async function runScript() {
    try {
        // Only run on Fiverr domains
        if (!window.location.hostname.includes('fiverr.com')) {
            console.log("Script only runs on Fiverr domains");
            return;
        }

        // Check toggle state before doing anything
        const shouldRunScript = await new Promise((resolve) => {
            chrome.runtime.sendMessage({action: "getStorage", key: "runScript"}, function(response) {
                resolve(response ? response.value : false);
            });
        });

        if (!shouldRunScript) {
            console.log("Toggle is OFF, removing all injected data.");
            removeExistingMarks();
            return;
        }

        console.log("Script starting...");
        // Updated selectors for new Fiverr card structure
        let AllCards = document.querySelectorAll(".gig-card-layout, .basic-gig-card, [data-testid='gig-card-base'], .gig-wrapper-impressions");
        console.log("Found cards:", AllCards.length);
        const processedLinks = new Set();

        for (const C of AllCards) {
            try {
                // Use chrome.runtime.sendMessage to get storage data from background script
                const shouldRunScript = await new Promise((resolve) => {
                    chrome.runtime.sendMessage({action: "getStorage", key: "runScript"}, function(response) {
                        console.log("Storage data:", response);
                        resolve(response ? response.value : true); 
                    });
                });

                if (!shouldRunScript) {
                    console.log("Script stopped while running, removing all what we doooo");
                    removeExistingMarks();
                    return;  
                }

                // Improved gig link selector for new Fiverr structure
                let gigLinkElem = C.querySelector('a[href*="/gig/"]') ||
                                 C.querySelector('a.media') ||
                                 C.querySelector('a[href*="/agencies/"]') ||
                                 C.querySelector('a.agency-contextual-link');
                let gigLink = gigLinkElem ? gigLinkElem.getAttribute('href') : null;
                if (gigLink && gigLink.startsWith('/')) {
                    gigLink = 'https://www.fiverr.com' + gigLink;
                }

                if (!gigLink || !gigLink.includes('fiverr.com')) {
                    console.log("Invalid or no gig link found for card", C.outerHTML.slice(0, 300));
                    continue;
                }
                console.log("Processing gig:", gigLink);
                
                if (!processedLinks.has(gigLink)) {
                    processedLinks.add(gigLink);
                    const QueueInfo = await fetchQueueInfo(gigLink);
                    console.log("Queue info for", gigLink, ":", QueueInfo);
                    
                    const existingMark = C.querySelector('mark');
                    if (existingMark) {
                        console.log("Skipping, <mark> already added.");
                        continue;  
                    }
                    
                    // Create the queue info element
                    const queueSpan = document.createElement('mark');
                    queueSpan.innerText = QueueInfo !== '0' ? `${QueueInfo} orders in queue ` : 'No orders in queue';
                    queueSpan.style.backgroundColor = QueueInfo !== '0' ? '#122349' : '#ff0000';
                    queueSpan.style.color = QueueInfo !== '0' ? '#1dbf73' : '#ffffff';
                    queueSpan.style.borderRadius = '6px';
                    queueSpan.style.padding = '2px 5px';
                    queueSpan.style.marginLeft = '5px';
                    queueSpan.style.display = 'inline-block';
                    queueSpan.style.fontSize = '12px';
                    queueSpan.style.fontWeight = 'bold';

                    // Updated target element selectors for new Fiverr structure
                    let targetElement = C.querySelector('.m-t-8.flex.XB8f1C9') || 
                                      C.querySelector('.orca-rating') ||
                                      C.querySelector('.rating-count-number') ||
                                      C.querySelector('.content-info') ||
                                      C.querySelector('.flex-between.flex-items-center.m-t-12') ||
                                      C.querySelector('.m-t-8.flex');

                    if (!targetElement) {
                        // If we can't find the target element, create a new div
                        targetElement = document.createElement('div');
                        targetElement.style.marginTop = '8px';
                        targetElement.style.display = 'flex';
                        targetElement.style.alignItems = 'center';
                        C.appendChild(targetElement);
                    }

                    console.log("Target element found:", targetElement);
                    targetElement.appendChild(queueSpan);
                    console.log("Queue span added to target");

                    if (parseInt(QueueInfo) >= 20) {
                        try {
                            const icon = document.createElement('img');
                            // Use fire.svg instead of star.svg since that's what you have
                            const iconUrl = chrome.runtime.getURL('images/fire.svg');
                            console.log('Icon URL:', iconUrl);
                            icon.src = iconUrl;
                            icon.style.width = '25px';
                            icon.style.marginLeft = '5px';
                            icon.style.filter = 'invert(48%) sepia(92%) saturate(749%) hue-rotate(1deg) brightness(104%) contrast(101%)';
                            targetElement.appendChild(icon);
                            console.log("Fire icon added");
                        } catch (iconError) {
                            console.error("Error adding icon:", iconError);
                        }
                    }
                }
            } catch (cardError) {
                console.error("Error processing card:", cardError);
                continue;
            }
        }
    } catch (error) {
        console.error("Main script error:", error);
    }
}

function removeExistingMarks() {
    try {
        const allMarks = document.querySelectorAll('mark');
        console.log("Removing", allMarks.length, "marks");
        allMarks.forEach(mark => {
            mark.remove();
        });
    } catch (error) {
        console.error("Error removing marks:", error);
    }
}

async function fetchQueueInfo(gigLink) {
    try {
        // Validate URL before fetching
        if (!gigLink.includes('fiverr.com')) {
            console.log("Skipping non-Fiverr URL:", gigLink);
            return '0';
        }

        console.log("Fetching queue info for:", gigLink);
        const response = await fetch(gigLink);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const scriptTags = doc.querySelectorAll("script");
        let ordersInQueue = 0;
        scriptTags.forEach(scriptTag => {
            if (scriptTag.textContent.includes('"ordersInQueue"')) {
                const match = scriptTag.textContent.match(/"ordersInQueue"\s*:\s*(\d+)/);
                if (match) {
                    ordersInQueue = match[1];
                }
            }
        });
        console.log("Orders in queue:", ordersInQueue);
        return ordersInQueue;
    } catch (err) {
        console.error('Error fetching queue info:', err);
        return '0';
    }
}

// Only run the script if we're on Fiverr
if (window.location.hostname.includes('fiverr.com')) {
    console.log("Script loaded, starting execution...");
    runScript();
} else {
    console.log("Not on Fiverr, script not running");
}

async function runScript() {

    let AllCards = document.getElementsByClassName("basic-gig-card");
    const processedLinks = new Set();

    
    for (const C of AllCards) {

        const shouldRunScript = await new Promise((resolve) => {
            chrome.storage.sync.get('runScript', function(data) {
                resolve(data.runScript); 
            });
        });

        if (!shouldRunScript) {
            console.log("Script stopped while running, removing all what we doooo");
            removeExistingMarks();
            return;  
        }
        const gigLink = C.querySelector('a').href;
        
        
        if (!processedLinks.has(gigLink)) {
            processedLinks.add(gigLink);
            const QueueInfo = await fetchQueueInfo(gigLink);
            
            const existingMark = C.querySelector('mark');
            if (existingMark) {
                console.log("Skipping, <mark> already added.");
                continue;  
            }
            
            const queueSpan = document.createElement('mark');
            QueueInfo !== '0' ? queueSpan.innerText = `${QueueInfo} orders in queue ` : queueSpan.innerText = 'M9aawdaa 3liiiih';
            QueueInfo !== '0' ? queueSpan.style.backgroundColor = '#122349' : queueSpan.style.backgroundColor = '#ff0000';
            QueueInfo !== '0' ? queueSpan.style.color = '#1dbf73' : queueSpan.style.color = '#ffffff';
            queueSpan.style.borderRadius = '6px';
            queueSpan.style.padding = '2px 5px';
            queueSpan.style.marginLeft = '5px';

            const targetElement = C.querySelector('.m-t-8.flex.XB8f1C9');
            if (targetElement) {
                targetElement.appendChild(queueSpan);
                if (parseInt(QueueInfo) >= 20)
                {
                    const icon = document.createElement('img');
                    const iconUrl = chrome.runtime.getURL('images/star.svg');
                    console.log('Icon URL:', iconUrl);
                    icon.src = iconUrl;
                    icon.style.width = '25px';
                    icon.style.filter = 'invert(48%) sepia(92%) saturate(749%) hue-rotate(1deg) brightness(104%) contrast(101%)'; // Gold color filter
                    queueSpan.style.marginLeft = '8px';
                    targetElement.appendChild(icon);
                }
            }
        }
    }
}


function removeExistingMarks() {
    const allMarks = document.querySelectorAll('mark');
    allMarks.forEach(mark => {
        mark.remove();
    });
}


async function fetchQueueInfo(gigLink) {
    try {
        const response = await fetch(gigLink);
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
        return ordersInQueue;
    } catch (err) {
        console.error('Error fetching queue info:', err);
        return null;
    }
}

runScript();

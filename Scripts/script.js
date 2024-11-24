



async function runScript() {
    let AllCards = document.getElementsByClassName("basic-gig-card");
    const spc = document.getElementsByClassName('m-t-8 flex XB8f1C9')[0];
    console.log(spc);
    console.log(AllCards);
    const processedLinks = new Set();
    for (const C of AllCards) {
        const gigLink = C.querySelector('a').href;
        if (!processedLinks.has(gigLink)) {
            processedLinks.add(gigLink);
            const QueueInfo = await fetchQueueInfo(gigLink);
            const queueSpan = document.createElement('mark');
            QueueInfo != '0' ? queueSpan.innerText = `${QueueInfo} orders in queue ` : queueSpan.innerText = 'M9aawdaa 3liiiih';
            QueueInfo != '0' ? queueSpan.style.backgroundColor = '#122349' : queueSpan.style.backgroundColor = '#ff0000';
            QueueInfo != '0' ? queueSpan.style.color = '#1dbf73' : queueSpan.style.color = '#ffffff';
            queueSpan.style.borderRadius = '6px';
            queueSpan.style.padding = '2px 5px';
            queueSpan.style.marginLeft = '5px';
            const targetElement = C.querySelector('.m-t-8.flex.XB8f1C9');
            if (targetElement) {
                targetElement.appendChild(queueSpan);
            }
        }
    }
}
runScript();

async function fetchQueueInfo(gigLink)
{
    try
    {
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
    }
    catch (err)
    {
        console.error('Error fetching queue info call Aymane Enq:', err);  
        return null;      
    }

}


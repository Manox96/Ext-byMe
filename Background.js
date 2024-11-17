

chrome.runtime.onMessage.addListener((msj,sender,sendResponse) =>{
    console.log("--> ", msj)
    if (msj.from === 'popup.js')
    {
        console.log('🔥🔥🔥 Message received 🔥🔥🔥');
        console.log('✅ URL: ' + msj.url );
    }
    sendResponse('🔥🔥🔥 Message received 🔥🔥🔥');
});
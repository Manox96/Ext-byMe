document.addEventListener('DOMContentLoaded', () => {
    let URL_input = document.getElementById('urlInput');
    let URL_button = document.getElementById('submitBtn');

    console.log('🔥🔥🔥 Script loaded 🔥🔥🔥');

    if (URL_button && URL_input) {
        console.log(URL_button);
        console.log(URL_input);

        URL_button.addEventListener('click', () => {
            let msj = {
                url: URL_input.value,
                from: 'popup.js'
            };
            chrome.runtime.sendMessage(msj);
            console.log('🔥🔥🔥 Message sent 🔥🔥🔥');
            URL_button.value = "";
        });
    } else {
        console.error('❌ URL_input or URL_button not found');
    }
});
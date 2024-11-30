document.addEventListener('DOMContentLoaded', () => {
    const checkBtn = document.getElementById('checkBtn');

    chrome.storage.sync.get('runScript', function(data) {
        checkBtn.checked = data.runScript || false;
    });

    checkBtn.addEventListener('change', (event) => {
        let IsChecked = event.target.checked;
        chrome.storage.sync.set({ runScript: IsChecked });
    });
});

console.log('Popup script loaded');


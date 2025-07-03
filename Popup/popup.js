document.addEventListener('DOMContentLoaded', () => {
    const checkBtn = document.getElementById('checkBtn');
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    const logoutBtn = document.getElementById('logout-btn');

    function updateStatus(isOn) {
        console.log('updateStatus called with:', isOn);
        if (!statusIndicator || !statusText) {
            console.warn('Status indicator or text not found!');
            return;
        }
        if (isOn) {
            statusIndicator.classList.remove('off');
            statusIndicator.classList.add('on');
            statusText.textContent = 'ON';
            statusText.style.color = '#1dbf73';
        } else {
            statusIndicator.classList.remove('on');
            statusIndicator.classList.add('off');
            statusText.textContent = 'OFF';
            statusText.style.color = '#e74c3c';
        }
    }

    chrome.storage.sync.get('runScript', function(data) {
        const isOn = !!data.runScript;
        checkBtn.checked = isOn;
        updateStatus(isOn);
        console.log('Initial state:', isOn);
    });

    checkBtn.addEventListener('change', (event) => {
        let IsChecked = event.target.checked;
        chrome.storage.sync.set({ runScript: IsChecked }, () => {
            updateStatus(IsChecked);
            console.log('Toggled:', IsChecked);
        });
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            chrome.storage.sync.set({ runScript: false }, () => {
                checkBtn.checked = false;
                updateStatus(false);
                console.log('Logged out and reset extension state');
            });
        });
    }
});

console.log('Popup script loaded');


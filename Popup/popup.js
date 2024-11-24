// document.addEventListener('DOMContentLoaded', () => {
//     const toggleCheckbox = document.getElementById('checkBtn');

//     if (toggleCheckbox) {
//         const extensionEnabled = localStorage.getItem('extensionEnabled') === 'true';
//         toggleCheckbox.checked = extensionEnabled;

//         toggleCheckbox.addEventListener('change', () => {
//             const isEnabled = toggleCheckbox.checked;
//             localStorage.setItem('extensionEnabled', isEnabled);
//             console.log(`Extension ${isEnabled ? 'activée' : 'désactivée'}`);

//             // Envoyer un message au script de fond pour démarrer/arrêter la logique
//             chrome.runtime.sendMessage({
//                 action: isEnabled ? 'start' : 'pause'
//             });
//         });
//     }
// });


console.log('Popup script loaded');
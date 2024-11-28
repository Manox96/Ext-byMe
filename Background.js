console.log("hyyy");

chrome.storage.sync.get('runScript', function(data) {
  console.log("-->" + data.runScript);
  data.runScript ? runScriptOnPage() : null;
});

chrome.storage.onChanged.addListener(function(changes, area) {
  if (area === "sync" && changes.runScript) {
    const shouldRunScript = changes.runScript.newValue;
    
    if (shouldRunScript) {
      runScriptOnPage();
    } else {
      stopScriptOnPage();
    }
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    chrome.storage.sync.get('runScript', function(data) {
      if (data.runScript) {
        runScriptOnPage();
      }
    });
  }
});

function runScriptOnPage() {
  console.log("Starting script...");
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs[0]) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['Scripts/script.js']
      });
    }
  });
}

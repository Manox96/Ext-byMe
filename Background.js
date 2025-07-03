console.log("hyyy");

chrome.storage.sync.get('runScript', function(data) {
  console.log("-->" + data.runScript);
  data.runScript ? runScriptOnPage() : runScriptOnPage();
});

chrome.storage.onChanged.addListener(function(changes, area) {
  if (area === "sync" && changes.runScript) {
    runScriptOnPage();
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    chrome.storage.sync.get('runScript', function(data) {
      runScriptOnPage();
    });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getStorage") {
    chrome.storage.sync.get(request.key, function(data) {
      sendResponse({value: data[request.key]});
    });
    return true;
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

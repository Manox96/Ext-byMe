

chrome.storage.onChanged.addListener(function(changes, area) {
    console.log("hyyy");
    if (area === "sync" && changes.runScript) {
      const shouldRunScript = changes.runScript.newValue;

    //   console.log(`Extension ${shouldRunScript ? 'activée' : 'désactivée'}`);

    console.log(shouldRunScript)

      if (shouldRunScript) {
        runScriptOnPage();
      } else {
        stopScriptOnPage();
      }
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
  
  // Function to stop the script if necessary
  function stopScriptOnPage() {
    console.log("Stopping script...");
  
    // You can add any cleanup here if needed (like removing elements or reverting changes)
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0]) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: stopScript // Optional cleanup function
        });
      }
    });
  }
  
//   // Optional cleanup function (e.g., removing added elements)
  function stopScript() {
    const elements = document.querySelectorAll('mark');  
    elements.forEach(element => element.remove());
    chrome.storage.sync.set({ stpFc: true });
  }

  
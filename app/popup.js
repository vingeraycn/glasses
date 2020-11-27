function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
      if(callback) callback(response);
    });
  });
}


function handleToggle() {
  sendMessageToContentScript({cmd: 'translate'}, function(response) {
  });
}

document.getElementById('btn').addEventListener('click', handleToggle)
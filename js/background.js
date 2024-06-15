/*
let tabData = {};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    tabData[tabId] = tab.url; // Store tab URL or other data
  }
});
*/
let currentTabUrl = '';

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    currentTabUrl = tab.url;
    //console.log(`Current tab URL updated: ${currentTabUrl}`);
  }
});

// Listen for tab activation
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    currentTabUrl = tab.url;
    //onsole.log(`Tab activated, URL: ${currentTabUrl}`);
  });
});

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getCurrentTabUrl') {
    sendResponse({ url: currentTabUrl });
  }
});
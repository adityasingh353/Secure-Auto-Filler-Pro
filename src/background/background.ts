// Ensure side panel opens when extension icon is clicked
if (typeof chrome !== 'undefined' && chrome.sidePanel) {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);
}

if (typeof chrome !== 'undefined' && chrome.action) {
  chrome.action.onClicked.addListener((tab) => {
    if (tab.windowId) {
      chrome.sidePanel.open({ windowId: tab.windowId });
    }
  });
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('Secure Auto-Filler Pro Installed');
  
  // Create context menu for quick fill
  chrome.contextMenus.create({
    id: "autoFillField",
    title: "Secure: Auto-Fill this field",
    contexts: ["editable"]
  });
});

chrome.contextMenus.onClicked.addListener((info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
  if (info.menuItemId === "fill-field" && tab?.id) {
    chrome.tabs.sendMessage(tab.id, { action: "fillCurrentField" }).catch(() => {
      // Content script might not be loaded, handle gracefully
      console.log('Content script not active on this page');
    });
  }
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((request: any, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
  if (request.action === 'getData') {
    // This is where we would securely decrypt and send data back to the content script
    // Only after verifying the user's intent and session status
    sendResponse({ status: 'locked' }); // Default to locked for now
  }
  return true; // Keep channel open for async response
});

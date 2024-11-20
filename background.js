// Handle installation and updates
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.sync.set({
      enabled: false,
      brightness: 100,
      contrast: 100,
      temperature: 4500,
      premium: false,
      siteSpecificSettings: {}
    });
  }
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'GET_SETTINGS':
      chrome.storage.sync.get(null, (settings) => {
        sendResponse(settings);
      });
      return true;

    case 'UPDATE_SETTINGS':
      chrome.storage.sync.set(request.settings, () => {
        // Notify all tabs about the settings update
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {
              type: 'SETTINGS_UPDATED',
              settings: request.settings
            });
          });
        });
        sendResponse({ success: true });
      });
      return true;

    case 'CHECK_PREMIUM':
      checkPremiumStatus().then(isPremium => {
        sendResponse({ premium: isPremium });
      });
      return true;
  }
});

async function checkPremiumStatus() {
  try {
    const settings = await chrome.storage.sync.get('premium');
    return settings.premium || false;
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
}
import { Settings } from './types';

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    const defaultSettings: Settings = {
      enabled: false,
      brightness: 100,
      contrast: 100,
      temperature: 4500,
      premium: false,
      siteSpecificSettings: {}
    };
    chrome.storage.sync.set(defaultSettings);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'GET_SETTINGS':
      chrome.storage.sync.get(null, (settings) => {
        sendResponse(settings);
      });
      return true;

    case 'UPDATE_SETTINGS':
      chrome.storage.sync.set(request.settings, () => {
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach(tab => {
            if (tab.id) {
              chrome.tabs.sendMessage(tab.id, {
                type: 'SETTINGS_UPDATED',
                settings: request.settings
              });
            }
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

async function checkPremiumStatus(): Promise<boolean> {
  try {
    const settings = await chrome.storage.sync.get('premium');
    return settings.premium || false;
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
}
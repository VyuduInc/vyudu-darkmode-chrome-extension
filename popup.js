document.addEventListener('DOMContentLoaded', async () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const brightnessSlider = document.getElementById('brightness');
  const contrastSlider = document.getElementById('contrast');
  const temperatureSlider = document.getElementById('temperature');
  const upgradeButton = document.getElementById('upgradeToPro');
  const subscriptionStatus = document.getElementById('subscriptionStatus');

  // Load initial settings
  const settings = await chrome.storage.sync.get({
    enabled: false,
    brightness: 100,
    contrast: 100,
    temperature: 4500,
    premium: false
  });

  // Update UI with current settings
  darkModeToggle.checked = settings.enabled;
  brightnessSlider.value = settings.brightness;
  contrastSlider.value = settings.contrast;
  temperatureSlider.value = settings.temperature;
  subscriptionStatus.textContent = settings.premium ? 'PRO' : 'FREE';

  // Event listeners for settings changes
  darkModeToggle.addEventListener('change', async () => {
    const enabled = darkModeToggle.checked;
    await updateSettings({ enabled });
  });

  brightnessSlider.addEventListener('input', debounce(async (e) => {
    const brightness = parseInt(e.target.value);
    await updateSettings({ brightness });
  }, 100));

  contrastSlider.addEventListener('input', debounce(async (e) => {
    const contrast = parseInt(e.target.value);
    await updateSettings({ contrast });
  }, 100));

  temperatureSlider.addEventListener('input', debounce(async (e) => {
    const temperature = parseInt(e.target.value);
    await updateSettings({ temperature });
  }, 100));

  upgradeButton.addEventListener('click', () => {
    chrome.tabs.create({
      url: 'https://your-domain.com/upgrade'
    });
  });

  // Helper function to update settings
  async function updateSettings(newSettings) {
    const settings = await chrome.storage.sync.get(null);
    const updatedSettings = { ...settings, ...newSettings };
    
    await chrome.storage.sync.set(updatedSettings);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'SETTINGS_UPDATED',
        settings: updatedSettings
      });
    });
  }

  // Debounce helper function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
});
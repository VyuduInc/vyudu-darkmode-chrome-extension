// Site-specific settings manager
export class SiteSettings {
  static async getCurrentSite() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return new URL(tab.url).hostname;
  }

  static async getSiteSettings(hostname) {
    const { siteSpecificSettings = {} } = await chrome.storage.sync.get('siteSpecificSettings');
    return siteSpecificSettings[hostname] || this.getDefaultSettings();
  }

  static async saveSiteSettings(hostname, settings) {
    const { siteSpecificSettings = {} } = await chrome.storage.sync.get('siteSpecificSettings');
    siteSpecificSettings[hostname] = settings;
    await chrome.storage.sync.set({ siteSpecificSettings });
  }

  static getDefaultSettings() {
    return {
      enabled: true,
      brightness: 100,
      contrast: 100,
      temperature: 6500,
      mode: 'dynamic'
    };
  }
}
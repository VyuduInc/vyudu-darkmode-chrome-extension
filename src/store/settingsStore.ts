import create from 'zustand';
import { Settings, SiteSettings } from '../types';

interface SettingsState {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  updateSiteSettings: (hostname: string, settings: SiteSettings) => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: {
    enabled: false,
    brightness: 100,
    contrast: 100,
    temperature: 6500,
    premium: false,
    siteSpecificSettings: {}
  },

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }));

    // Sync with storage
    chrome.storage.sync.set(newSettings);

    // Notify content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'UPDATE_SETTINGS',
          settings: get().settings
        });
      }
    });
  },

  updateSiteSettings: (hostname, siteSettings) => {
    set((state) => ({
      settings: {
        ...state.settings,
        siteSpecificSettings: {
          ...state.settings.siteSpecificSettings,
          [hostname]: siteSettings
        }
      }
    }));

    // Sync with storage
    chrome.storage.sync.set({
      siteSpecificSettings: get().settings.siteSpecificSettings
    });
  },

  loadSettings: async () => {
    const settings = await chrome.storage.sync.get(null);
    set({ settings: settings as Settings });
  }
}));
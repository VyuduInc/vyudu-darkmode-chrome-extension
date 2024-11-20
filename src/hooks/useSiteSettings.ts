import { useEffect, useState } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { SiteSettings } from '../types';

export function useSiteSettings() {
  const [currentSite, setCurrentSite] = useState<string>('');
  const { settings, updateSiteSettings } = useSettingsStore();

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        const hostname = new URL(tabs[0].url).hostname;
        setCurrentSite(hostname);
      }
    });
  }, []);

  const siteSettings = currentSite 
    ? settings.siteSpecificSettings[currentSite] 
    : null;

  const updateCurrentSiteSettings = (newSettings: Partial<SiteSettings>) => {
    if (!currentSite) return;

    const updatedSettings = {
      ...settings.siteSpecificSettings[currentSite],
      ...newSettings
    };

    updateSiteSettings(currentSite, updatedSettings as SiteSettings);
  };

  return {
    currentSite,
    siteSettings,
    updateSiteSettings: updateCurrentSiteSettings
  };
}
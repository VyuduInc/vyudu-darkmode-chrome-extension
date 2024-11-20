import React from 'react';
import { Crown } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';

export function PremiumBanner() {
  const { settings } = useSettingsStore();

  if (settings.premium) return null;

  const handleUpgradeClick = () => {
    chrome.tabs.create({
      url: 'https://elegant-dark-pro.netlify.app/upgrade'
    });
  };

  return (
    <div className="p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Crown className="w-5 h-5 text-yellow-300" />
          <div>
            <h3 className="text-sm font-semibold">Upgrade to Pro</h3>
            <p className="text-xs text-indigo-200">Unlock all features</p>
          </div>
        </div>
        <button 
          onClick={handleUpgradeClick}
          className="px-4 py-2 text-xs font-medium text-indigo-700 bg-white rounded-lg hover:bg-indigo-50 transition-colors"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
}
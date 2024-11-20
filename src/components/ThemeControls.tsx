import React from 'react';
import { Moon, Sun, Sliders, Palette, Settings2 } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';
import { useSiteSettings } from '../hooks/useSiteSettings';

export function ThemeControls() {
  const { settings, updateSettings } = useSettingsStore();
  const { siteSettings, updateSiteSettings } = useSiteSettings();

  const currentSettings = siteSettings || settings;

  const handleModeChange = (mode: string) => {
    if (siteSettings) {
      updateSiteSettings({ mode });
    } else {
      updateSettings({ mode });
    }
  };

  const handleSliderChange = (key: string, value: number) => {
    if (siteSettings) {
      updateSiteSettings({ [key]: value });
    } else {
      updateSettings({ [key]: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {['dynamic', 'contrast', 'gentle'].map((mode) => (
          <button
            key={mode}
            onClick={() => handleModeChange(mode)}
            className={`p-3 rounded-lg flex flex-col items-center justify-center space-y-2 transition-all ${
              currentSettings.mode === mode
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {mode === 'dynamic' && <Palette className="w-5 h-5" />}
            {mode === 'contrast' && <Sliders className="w-5 h-5" />}
            {mode === 'gentle' && <Settings2 className="w-5 h-5" />}
            <span className="text-xs font-medium capitalize">{mode}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {[
          { key: 'brightness', label: 'Brightness', min: 50, max: 150 },
          { key: 'contrast', label: 'Contrast', min: 50, max: 150 },
          { key: 'temperature', label: 'Temperature', min: 5000, max: 7500 }
        ].map((control) => (
          <div key={control.key} className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-gray-600">
                {control.label}
              </label>
              <span className="text-sm text-gray-500">
                {currentSettings[control.key]}
              </span>
            </div>
            <input
              type="range"
              min={control.min}
              max={control.max}
              value={currentSettings[control.key]}
              onChange={(e) => handleSliderChange(control.key, Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
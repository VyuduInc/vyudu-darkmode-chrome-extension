/**
 * Elegant Dark Pro - Chrome Extension
 * Copyright (c) 2024 Vyudu Inc. (http://www.vyudu.com)
 * Chief Code Architect: Jeremy Merrell Williams
 */

import React, { useState } from 'react';
import { Moon, Sun, Sliders, Palette, Settings2 } from 'lucide-react';

function App() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState('dynamic');
  const [settings, setSettings] = useState({
    brightness: 100,
    contrast: 100,
    temperature: 6500
  });

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-[360px] p-4 bg-white">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {enabled ? 
            <Moon className="w-6 h-6 text-indigo-600" /> : 
            <Sun className="w-6 h-6 text-indigo-600" />
          }
          <h1 className="text-xl font-semibold text-gray-900">Elegant Dark Pro</h1>
        </div>
        <button 
          onClick={() => setEnabled(!enabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </header>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-2">
          {['dynamic', 'contrast', 'gentle'].map((modeOption) => (
            <button
              key={modeOption}
              onClick={() => handleModeChange(modeOption)}
              className={`p-3 rounded-lg flex flex-col items-center justify-center space-y-2 transition-all ${
                mode === modeOption
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {modeOption === 'dynamic' && <Palette className="w-5 h-5" />}
              {modeOption === 'contrast' && <Sliders className="w-5 h-5" />}
              {modeOption === 'gentle' && <Settings2 className="w-5 h-5" />}
              <span className="text-xs font-medium capitalize">{modeOption}</span>
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
                  {settings[control.key]}
                </span>
              </div>
              <input
                type="range"
                min={control.min}
                max={control.max}
                value={settings[control.key]}
                onChange={(e) => handleSettingChange(control.key, Number(e.target.value))}
                className="w-full"
              />
            </div>
          ))}
        </div>

        <div className="p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Upgrade to Pro</h3>
              <p className="text-sm text-indigo-200">Unlock all features</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white rounded-lg hover:bg-indigo-50 transition-colors">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
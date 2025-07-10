'use client';

import React, { useState } from 'react';
import { DynamicBackground, backgroundPresets, BackgroundConfig } from '@/components/backgrounds/DynamicBackground';
import { BackgroundPreview, BackgroundPresetGrid } from '@/components/backgrounds/BackgroundPreview';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { validateBackgroundConfig } from '@/lib/backgrounds/utils';

export default function BackgroundDemo() {
  const [selectedPreset, setSelectedPreset] = useState<string>('dark-elegant');
  const [customConfig, setCustomConfig] = useState<BackgroundConfig>({
    type: 'color',
    lightColor: '#f8fafc',
    darkColor: '#0f172a',
  });
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  const getCurrentConfig = (): BackgroundConfig => {
    if (activeTab === 'presets' && backgroundPresets[selectedPreset]) {
      return backgroundPresets[selectedPreset];
    }
    return customConfig;
  };

  const validationErrors = validateBackgroundConfig(getCurrentConfig());

  return (
    <div className="min-h-screen p-4 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Background System Demo
            </h1>
            <p className="text-gray-700 dark:text-gray-200">
              Test the dynamic background system with different themes and configurations
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'presets'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Presets
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'custom'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Custom
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {activeTab === 'presets' ? 'Preset Selection' : 'Custom Configuration'}
              </h2>

              {activeTab === 'presets' ? (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Choose a preset:
                  </label>
                  <select
                    value={selectedPreset}
                    onChange={(e) => setSelectedPreset(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.keys(backgroundPresets).map((preset) => (
                      <option key={preset} value={preset}>
                        {preset.replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Background Type:
                    </label>
                    <select
                      value={customConfig.type}
                      onChange={(e) => setCustomConfig({ 
                        ...customConfig, 
                        type: e.target.value as BackgroundConfig['type']
                      })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="color">Solid Color</option>
                      <option value="gradient">Gradient</option>
                      <option value="image">Image</option>
                      <option value="pattern">Pattern</option>
                    </select>
                  </div>

                  {customConfig.type === 'color' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Light Color:
                        </label>
                        <input
                          type="color"
                          value={customConfig.lightColor || '#ffffff'}
                          onChange={(e) => setCustomConfig({ 
                            ...customConfig, 
                            lightColor: e.target.value 
                          })}
                          className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Dark Color:
                        </label>
                        <input
                          type="color"
                          value={customConfig.darkColor || '#000000'}
                          onChange={(e) => setCustomConfig({ 
                            ...customConfig, 
                            darkColor: e.target.value 
                          })}
                          className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {customConfig.type === 'gradient' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Light Gradient CSS:
                        </label>
                        <textarea
                          value={customConfig.lightGradient || ''}
                          onChange={(e) => setCustomConfig({ 
                            ...customConfig, 
                            lightGradient: e.target.value 
                          })}
                          placeholder="linear-gradient(135deg, #fff 0%, #f0f0f0 100%)"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Dark Gradient CSS:
                        </label>
                        <textarea
                          value={customConfig.darkGradient || ''}
                          onChange={(e) => setCustomConfig({ 
                            ...customConfig, 
                            darkGradient: e.target.value 
                          })}
                          placeholder="linear-gradient(135deg, #333 0%, #000 100%)"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={2}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                    Configuration Issues:
                  </h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Configuration Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Configuration
              </h3>
              <pre className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3 rounded border overflow-auto">
                {JSON.stringify(getCurrentConfig(), null, 2)}
              </pre>
            </div>
          </div>

          {/* Live Preview */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Live Preview
              </h3>
              <BackgroundPreview 
                config={getCurrentConfig()}
                className="h-64 w-full rounded-lg"
              />
            </div>

            {/* Full Screen Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Full Screen Example
              </h3>
              <div className="relative h-40 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <DynamicBackground 
                  config={getCurrentConfig()}
                  className="w-full h-full"
                >
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-white drop-shadow-lg">
                      <h4 className="text-xl font-bold mb-2">Your Page Content</h4>
                      <p className="text-sm opacity-90">
                        This is how your background will look with content
                      </p>
                    </div>
                  </div>
                </DynamicBackground>
              </div>
            </div>
          </div>
        </div>

        {/* All Presets Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <BackgroundPresetGrid />
        </div>
      </div>
    </div>
  );
}

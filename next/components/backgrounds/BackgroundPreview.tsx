'use client';

import React from 'react';
import { DynamicBackground, backgroundPresets, BackgroundConfig } from './DynamicBackground';
import { useTheme } from '@/context/ThemeContext';

interface BackgroundPreviewProps {
  config?: BackgroundConfig;
  preset?: string;
  className?: string;
}

export function BackgroundPreview({ config, preset, className = 'h-32 w-full rounded-lg' }: BackgroundPreviewProps) {
  let backgroundConfig: BackgroundConfig;

  if (preset && backgroundPresets[preset]) {
    backgroundConfig = backgroundPresets[preset];
  } else if (config) {
    backgroundConfig = config;
  } else {
    // Default preview background
    backgroundConfig = {
      type: 'gradient',
      lightGradient: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      darkGradient: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    };
  }

  return (
    <div className={`relative border border-gray-200 dark:border-gray-700 ${className}`}>
      <DynamicBackground 
        config={backgroundConfig}
        className="w-full h-full"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 bg-white/80 dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">
              {preset ? preset : backgroundConfig.type}
            </div>
            <div className="text-xs text-gray-800 dark:text-gray-200 bg-white/80 dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm mt-1">
              Background Preview
            </div>
          </div>
        </div>
      </DynamicBackground>
    </div>
  );
}

// Component to show all available presets
export function BackgroundPresetGrid() {
  const { resolvedTheme } = useTheme();
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      <h3 className="col-span-full text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Available Background Presets (Current theme: {resolvedTheme})
      </h3>
      {Object.keys(backgroundPresets).map((presetKey) => (
        <div key={presetKey} className="space-y-2">
          <BackgroundPreview 
            preset={presetKey}
            className="h-24 w-full rounded-md"
          />
          <div className="text-xs text-center text-gray-900 dark:text-gray-100 capitalize">
            {presetKey.replace('-', ' ')}
          </div>
        </div>
      ))}
    </div>
  );
}
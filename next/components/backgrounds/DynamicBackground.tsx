'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

export interface BackgroundConfig {
  type: 'color' | 'gradient' | 'image' | 'pattern';
  
  // For solid colors
  lightColor?: string;
  darkColor?: string;
  
  // For gradients
  lightGradient?: string;
  darkGradient?: string;
  
  // For images
  lightImage?: string;
  darkImage?: string;
  
  // For patterns
  lightPattern?: string;
  darkPattern?: string;
  
  // Common properties
  opacity?: number;
  overlay?: boolean;
  overlayOpacity?: number;
}

interface DynamicBackgroundProps {
  config: BackgroundConfig;
  className?: string;
  children?: React.ReactNode;
}

export function DynamicBackground({ config, className = '', children }: DynamicBackgroundProps) {
  const { resolvedTheme } = useTheme();
  
  const getBackgroundStyle = (): React.CSSProperties => {
    const isLight = resolvedTheme === 'light';
    const style: React.CSSProperties = {};
    
    switch (config.type) {
      case 'color':
        style.backgroundColor = isLight ? config.lightColor : config.darkColor;
        break;
        
      case 'gradient':
        style.background = isLight ? config.lightGradient : config.darkGradient;
        break;
        
      case 'image':
        const imageUrl = isLight ? config.lightImage : config.darkImage;
        if (imageUrl) {
          style.backgroundImage = `url(${imageUrl})`;
          style.backgroundSize = 'cover';
          style.backgroundPosition = 'center';
          style.backgroundRepeat = 'no-repeat';
        }
        break;
        
      case 'pattern':
        const patternUrl = isLight ? config.lightPattern : config.darkPattern;
        if (patternUrl) {
          style.backgroundImage = `url(${patternUrl})`;
          style.backgroundRepeat = 'repeat';
        }
        break;
    }
    
    if (config.opacity !== undefined) {
      style.opacity = config.opacity;
    }
    
    return style;
  };

  return (
    <div 
      className={`relative ${className}`}
      style={getBackgroundStyle()}
    >
      {config.overlay && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: config.overlayOpacity || 0.3 }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Predefined background presets
export const backgroundPresets: Record<string, BackgroundConfig> = {
  // Solid colors
  'dark-elegant': {
    type: 'color',
    lightColor: '#f8fafc',
    darkColor: '#0f172a',
  },
  
  'purple-theme': {
    type: 'color',
    lightColor: '#faf5ff',
    darkColor: '#581c87',
  },
  
  // Gradients
  'sunset': {
    type: 'gradient',
    lightGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    darkGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  
  'ocean': {
    type: 'gradient',
    lightGradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    darkGradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
  },
  
  'cosmic': {
    type: 'gradient',
    lightGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    darkGradient: 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)',
  },
  
  'aurora': {
    type: 'gradient',
    lightGradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    darkGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
};

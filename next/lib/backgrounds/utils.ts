import { BackgroundConfig } from '@/components/backgrounds/DynamicBackground';
import { StrapiBackgroundSettings } from '@/types/strapi';
import { backgroundPresets } from '@/components/backgrounds/DynamicBackground';

/**
 * Converts Strapi background settings to our BackgroundConfig format
 */
export function convertStrapiBackgroundToConfig(strapiBackground?: StrapiBackgroundSettings): BackgroundConfig {
  if (!strapiBackground) {
    // Default background if none set
    return {
      type: 'gradient',
      lightGradient: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      darkGradient: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    };
  }

  // If using a preset
  if (strapiBackground.type === 'preset' && strapiBackground.preset && backgroundPresets[strapiBackground.preset]) {
    return backgroundPresets[strapiBackground.preset];
  }

  // Custom background configuration
  return {
    type: strapiBackground.type as 'color' | 'gradient' | 'image' | 'pattern',
    lightColor: strapiBackground.lightColor,
    darkColor: strapiBackground.darkColor,
    lightGradient: strapiBackground.lightGradient,
    darkGradient: strapiBackground.darkGradient,
    lightImage: strapiBackground.lightImage?.url,
    darkImage: strapiBackground.darkImage?.url,
    lightPattern: strapiBackground.lightPattern?.url,
    darkPattern: strapiBackground.darkPattern?.url,
    opacity: strapiBackground.opacity,
    overlay: strapiBackground.overlay,
    overlayOpacity: strapiBackground.overlayOpacity,
  };
}

/**
 * Validates a background configuration to ensure all required fields are present
 */
export function validateBackgroundConfig(config: BackgroundConfig): string[] {
  const errors: string[] = [];

  switch (config.type) {
    case 'color':
      if (!config.lightColor && !config.darkColor) {
        errors.push('Color background requires at least one color (light or dark)');
      }
      break;
    case 'gradient':
      if (!config.lightGradient && !config.darkGradient) {
        errors.push('Gradient background requires at least one gradient (light or dark)');
      }
      break;
    case 'image':
      if (!config.lightImage && !config.darkImage) {
        errors.push('Image background requires at least one image (light or dark)');
      }
      break;
    case 'pattern':
      if (!config.lightPattern && !config.darkPattern) {
        errors.push('Pattern background requires at least one pattern (light or dark)');
      }
      break;
    default:
      errors.push('Invalid background type');
  }

  if (config.opacity !== undefined && (config.opacity < 0 || config.opacity > 1)) {
    errors.push('Opacity must be between 0 and 1');
  }

  if (config.overlayOpacity !== undefined && (config.overlayOpacity < 0 || config.overlayOpacity > 1)) {
    errors.push('Overlay opacity must be between 0 and 1');
  }

  return errors;
}

/**
 * Gets a list of all available preset names
 */
export function getAvailablePresets(): string[] {
  return Object.keys(backgroundPresets);
}

/**
 * Checks if a preset name is valid
 */
export function isValidPreset(presetName: string): boolean {
  return presetName in backgroundPresets;
}

export interface StrapiBackgroundSettings {
  id?: number;
  type: 'color' | 'gradient' | 'image' | 'pattern' | 'preset';
  
  // Preset option
  preset?: string;
  
  // Color settings
  lightColor?: string;
  darkColor?: string;
  
  // Gradient settings
  lightGradient?: string;
  darkGradient?: string;
  
  // Image settings  
  lightImage?: {
    url: string;
    alternativeText?: string;
  };
  darkImage?: {
    url: string;
    alternativeText?: string;
  };
  
  // Pattern settings
  lightPattern?: {
    url: string;
    alternativeText?: string;
  };
  darkPattern?: {
    url: string;
    alternativeText?: string;
  };
  
  // Advanced settings
  opacity?: number;
  overlay?: boolean;
  overlayOpacity?: number;
}

export interface StrapiPage {
  id: number;
  title: string;
  slug: string;
  locale: string;
  backgroundSettings?: StrapiBackgroundSettings;
  dynamic_zone?: any[];
  seo?: any;
  localizations?: any[];
}

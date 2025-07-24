// ============================================================================
// ARCHITECTURAL ANIMATION DEBUG CONFIGURATION
// ============================================================================
// 
// TO DISABLE ALL DEBUG LOGGING:
// Change `enabled: true` to `enabled: false` in DEBUG_CONFIG below
//
// TO DISABLE SPECIFIC CATEGORIES:
// Set individual categories to false (e.g. animations: false, opacity: false)
//
// This will significantly improve page load performance when disabled
// ============================================================================

export const DEBUG_CONFIG = {
  // 🔧 MAIN DEBUG TOGGLE - Set to false to disable ALL debugging and improve performance
  enabled: false,
  
  // 🎯 Specific debug categories - only work if main flag is enabled
  categories: {
    animations: true,   // Animation start/stop/progress logs
    mounting: true,     // Component mounting/unmounting logs  
    opacity: true,      // Opacity changes during animations
    rendering: true,    // Element loading and visibility logs
    lifecycle: true     // Component lifecycle logs
  }
} as const;

// Debug logger that respects the configuration
export const debugLog = {
  animation: (...args: any[]) => {
    if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.categories.animations) {
      console.log('[ARCH-ANIM]', ...args);
    }
  },
  
  mounting: (...args: any[]) => {
    if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.categories.mounting) {
      console.log('[ARCH-MOUNT]', ...args);
    }
  },
  
  opacity: (...args: any[]) => {
    if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.categories.opacity) {
      console.log('[ARCH-OPACITY]', ...args);
    }
  },
  
  rendering: (...args: any[]) => {
    if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.categories.rendering) {
      console.log('[ARCH-RENDER]', ...args);
    }
  },
  
  lifecycle: (...args: any[]) => {
    if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.categories.lifecycle) {
      console.log('[ARCH-LIFECYCLE]', ...args);
    }
  },
  
  // General log for uncategorized debug info
  general: (...args: any[]) => {
    if (DEBUG_CONFIG.enabled) {
      console.log('[ARCH-DEBUG]', ...args);
    }
  }
};

// Performance timing helper
export const debugTime = {
  start: (label: string) => {
    if (DEBUG_CONFIG.enabled) {
      console.time(`[ARCH-PERF] ${label}`);
    }
  },
  
  end: (label: string) => {
    if (DEBUG_CONFIG.enabled) {
      console.timeEnd(`[ARCH-PERF] ${label}`);
    }
  }
};

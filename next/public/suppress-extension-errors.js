// Suppress browser extension errors during development
(function() {
  const originalConsoleError = console.error;
  
  console.error = function(...args) {
    // Check if any argument contains extension-related content
    const hasExtensionError = args.some(arg => 
      typeof arg === 'string' && (
        arg.includes('chrome-extension://') ||
        arg.includes('inpage.js') ||
        arg.includes('Extension error')
      )
    );
    
    if (!hasExtensionError) {
      originalConsoleError.apply(console, args);
    } else {
      console.warn('Extension error suppressed:', ...args);
    }
  };

  // Suppress unhandled extension errors
  window.addEventListener('error', function(event) {
    if (event.filename && event.filename.includes('chrome-extension://')) {
      event.preventDefault();
      return true;
    }
  });

  // Suppress unhandled extension promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && event.reason.stack && event.reason.stack.includes('chrome-extension://')) {
      event.preventDefault();
      return true;
    }
  });
})();

'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Only catch extension-related errors, not app errors
    const isExtensionError = !!(error.stack?.includes('chrome-extension://') || 
                               error.message?.includes('extension') ||
                               error.stack?.includes('inpage.js'));
    
    return { hasError: isExtensionError, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Only log extension errors as warnings, not app errors
    if (error.stack?.includes('chrome-extension://')) {
      console.warn('Browser extension error (safe to ignore):', error);
    } else {
      console.error('Application error:', error, errorInfo);
      // Re-throw app errors so they show up properly
      throw error;
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}

// Hook version for function components
export function useErrorHandler() {
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Suppress extension errors from showing in console
      if (event.filename?.includes('chrome-extension://') || 
          event.error?.stack?.includes('chrome-extension://')) {
        event.preventDefault();
        console.warn('Browser extension error suppressed:', event.error);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Check if the rejection is from an extension
      const { reason } = event;
      if (reason?.stack?.includes('chrome-extension://')) {
        event.preventDefault();
        console.warn('Browser extension promise rejection suppressed:', reason);
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
}

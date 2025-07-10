"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type, duration };
    
    // Check if toast with same message already exists to prevent duplicates
    setToasts(prev => {
      const existingToast = prev.find(toast => toast.message === message);
      if (existingToast) {
        return prev; // Don't add duplicate
      }
      return [...prev, newToast];
    });
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts(current => current.filter(toast => toast.id !== id));
      }, duration);
    }
  }, []);

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-br from-green-300/15 via-green-400/20 to-green-500/25 text-white border-green-200/20 shadow-green-400/10';
      case 'error':
        return 'bg-gradient-to-br from-red-300/15 via-red-400/20 to-red-500/25 text-white border-red-200/20 shadow-red-400/10';
      case 'warning':
        return 'bg-gradient-to-br from-yellow-200/20 via-yellow-300/25 to-yellow-400/30 text-gray-900 border-yellow-100/25 shadow-yellow-300/10';
      case 'info':
      default:
        return 'bg-gradient-to-br from-blue-300/15 via-blue-400/20 to-blue-500/25 text-white border-blue-200/20 shadow-blue-400/10';
    }
  };

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3 
              }}
              className={`
                relative flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl 
                min-w-[320px] max-w-[500px] pointer-events-auto cursor-pointer border border-white/10
                font-medium text-sm leading-relaxed backdrop-blur-xl backdrop-saturate-150
                before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br 
                before:from-white/15 before:via-white/5 before:to-transparent before:pointer-events-none
                after:absolute after:top-0 after:left-6 after:right-6 after:h-px 
                after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent
                ${getToastStyles(toast.type)}
              `}
              onClick={() => hideToast(toast.id)}
            >
              <span className="relative z-10 text-xl font-bold flex-shrink-0 drop-shadow-sm" aria-hidden="true">
                {getToastIcon(toast.type)}
              </span>
              <span className="relative z-10 flex-1 text-sm font-medium break-words drop-shadow-sm">
                {toast.message}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  hideToast(toast.id);
                }}
                className={`
                  relative z-10 text-xl leading-none flex-shrink-0 ml-2 w-6 h-6 
                  flex items-center justify-center rounded-full 
                  transition-all duration-200 drop-shadow-sm
                  ${toast.type === 'warning' 
                    ? 'text-gray-800/80 hover:text-gray-900 bg-gray-900/20 hover:bg-gray-900/30 border border-gray-700/30' 
                    : 'text-white/60 hover:text-white bg-white/15 hover:bg-white/25 border border-white/20'
                  }
                `}
                aria-label="Close notification"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

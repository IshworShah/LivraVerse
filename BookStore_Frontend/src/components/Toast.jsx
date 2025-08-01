import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
          icon: 'fas fa-check-circle',
          border: 'border-green-400/30'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-pink-500',
          icon: 'fas fa-exclamation-circle',
          border: 'border-red-400/30'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          icon: 'fas fa-exclamation-triangle',
          border: 'border-yellow-400/30'
        };
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          icon: 'fas fa-info-circle',
          border: 'border-blue-400/30'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
          icon: 'fas fa-check-circle',
          border: 'border-green-400/30'
        };
    }
  };

  const styles = getToastStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed top-4 right-4 z-50 max-w-sm w-full mx-4 sm:mx-0`}
        >
          <div className={`${styles.bg} text-white p-4 rounded-2xl shadow-2xl border ${styles.border} backdrop-blur-xl`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <i className={`${styles.icon} text-xl`}></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-relaxed">{message}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="ml-4 text-white/80 hover:text-white transition-colors duration-200 flex-shrink-0"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>
            
            {/* Progress bar */}
            {duration > 0 && (
              <motion.div
                className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="h-full bg-white/60 rounded-full"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: duration / 1000, ease: "linear" }}
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;

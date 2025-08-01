import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Modern, Minimalist Loading Spinner Component
 * Clean circular spinner with smooth animations and professional appearance
 */
export const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Loading...', 
  showMessage = true,
  className = '',
  variant = 'default',
  fullScreen = false
}) => {
  // Size configurations for responsive scaling
  const sizeConfigs = {
    small: { size: 24, stroke: 2 },
    medium: { size: 40, stroke: 2.5 }, 
    large: { size: 56, stroke: 3 },
    xlarge: { size: 72, stroke: 3.5 }
  };

  // Minimalist color variants
  const getSpinnerColor = (variant) => {
    switch (variant) {
      case 'light': return 'stroke-gray-400';
      case 'dark': return 'stroke-gray-700';
      case 'soft': return 'stroke-gray-500';
      default: return 'stroke-gray-600 dark:stroke-gray-400';
    }
  };

  // Container configurations
  const containerClasses = fullScreen 
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm'
    : 'flex flex-col items-center justify-center min-h-[200px]';

  const config = sizeConfigs[size];
  const strokeColor = getSpinnerColor(variant);

  return (
    <div 
      className={cn(containerClasses, 'space-y-6')}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* Modern SVG Spinner */}
      <div className="relative">
        <svg
          className={cn(
            'animate-spin',
            'opacity-0 animate-fade-in',
            className
          )}
          width={config.size}
          height={config.size}
          viewBox="0 0 50 50"
          style={{
            animation: 'spin 1.2s linear infinite, pulse 2s ease-in-out infinite alternate'
          }}
        >
          {/* Background circle - subtle */}
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth={config.stroke * 0.5}
            className="stroke-gray-200 dark:stroke-gray-700 opacity-20"
          />
          
          {/* Animated arc - main spinner */}
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray="31.416"
            strokeDashoffset="31.416"
            className={cn(strokeColor, 'opacity-80')}
            style={{
              animation: 'dash 1.5s ease-in-out infinite'
            }}
          />
        </svg>
      </div>
      
      {/* Loading message */}
      {showMessage && (
        <div className="text-center animate-fade-in">
          <p className="text-gray-500 dark:text-gray-400 font-normal text-sm tracking-wide">
            {message}
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes dash {
          0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
          }
          100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
          }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.05); opacity: 1; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

/**
 * Minimalist Inline Loading Spinner for buttons and small components
 */
export const InlineSpinner = ({ 
  size = 16, 
  className = '',
  variant = 'current'
}) => {
  const colorClasses = {
    current: 'stroke-current',
    white: 'stroke-white',
    light: 'stroke-gray-400',
    dark: 'stroke-gray-600',
    soft: 'stroke-gray-500'
  };

  return (
    <svg 
      className={cn('animate-spin', className)}
      width={size} 
      height={size} 
      viewBox="0 0 50 50"
      role="status"
      aria-hidden="true"
      style={{
        animation: 'spin 1.2s linear infinite'
      }}
    >
      {/* Background circle */}
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="stroke-gray-200 dark:stroke-gray-700 opacity-20"
      />
      
      {/* Animated arc */}
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="31.416"
        strokeDashoffset="31.416"
        className={cn(colorClasses[variant], 'opacity-80')}
        style={{
          animation: 'dash 1.5s ease-in-out infinite'
        }}
      />
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes dash {
          0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
          }
          100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
          }
        }
      `}</style>
    </svg>
  );
};

/**
 * Section-specific loading configurations with modern styling
 */
export const SectionLoadingSpinner = ({ section, ...props }) => {
  const sectionConfigs = {
    events: {
      size: 'medium',
      variant: 'soft',
      message: 'Loading events...'
    },
    directory: {
      size: 'medium', 
      variant: 'default',
      message: 'Loading alumni directory...'
    },
    blog: {
      size: 'medium',
      variant: 'default', 
      message: 'Loading blog posts...'
    },
    dashboard: {
      size: 'medium',
      variant: 'soft',
      message: 'Loading dashboard...'
    },
    mentorship: {
      size: 'medium',
      variant: 'dark',
      message: 'Loading mentorship data...'
    },
    profile: {
      size: 'medium',
      variant: 'default',
      message: 'Loading profile...'
    },
    settings: {
      size: 'medium', 
      variant: 'light',
      message: 'Loading settings...'
    }
  };

  const config = sectionConfigs[section] || sectionConfigs.dashboard;
  
  return <LoadingSpinner {...config} {...props} />;
};

export default LoadingSpinner;

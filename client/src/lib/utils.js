import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Get the API base URL for development environment
 */
export const getApiBaseUrl = () => {
  return 'http://localhost:5000/api';
};

/**
 * Format a date for display
 * @param {Date|string} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
  // Make a copy of options to avoid modifying the original
  const safeOptions = { ...options };
  
  // If dateStyle or timeStyle is specified, we can't use individual date components
  const defaultOptions = safeOptions.dateStyle || safeOptions.timeStyle
    ? {}
    : {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
  
  const dateToFormat = date instanceof Date ? date : new Date(date);
  
  // Handle invalid dates gracefully
  if (isNaN(dateToFormat.getTime())) {
    console.warn('Invalid date provided to formatDate:', date);
    return 'Invalid date';
  }
  
  try {
    // Merge options correctly
    const finalOptions = safeOptions.dateStyle || safeOptions.timeStyle
      ? safeOptions  // If dateStyle/timeStyle is present, don't mix with individual components
      : { ...defaultOptions, ...safeOptions };
      
    return new Intl.DateTimeFormat('en-US', finalOptions).format(dateToFormat);
  } catch (error) {
    console.error('Error formatting date:', error, 'with options:', safeOptions);
    // Fallback to a basic format
    return dateToFormat.toLocaleDateString();
  }
}

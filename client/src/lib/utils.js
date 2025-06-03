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
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const dateToFormat = date instanceof Date ? date : new Date(date);
  
  return new Intl.DateTimeFormat('en-US', {
    ...defaultOptions,
    ...options
  }).format(dateToFormat);
}

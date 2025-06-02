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

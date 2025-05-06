import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Get the appropriate API base URL depending on the environment
 * In development: use localhost
 * In production: use the deployed Vercel API URL
 */
export const getApiBaseUrl = () => {
  const isProduction = import.meta.env.PROD;
  
  if (isProduction) {
    // Production - use Vercel API URL with your actual domain
    return 'https://alumni-network-api.vercel.app/api';
  }
  
  // Development - use localhost
  return 'http://localhost:5000/api';
};

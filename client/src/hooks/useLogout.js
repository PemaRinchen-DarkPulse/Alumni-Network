import { useState } from 'react';
import { logoutUser } from '../services/authService';

/**
 * Hook for handling user logout functionality
 * @param {Function} setUser - Function to clear user state on logout
 * @param {Function} setToken - Function to clear token state on logout
 * @returns {Object} Object containing logout functionality and state
 */
export const useLogout = (setUser, setToken) => {
  /**
   * Logout a user
   * @param {Function} navigate - React Router's navigate function (optional)
   */  const logout = (navigate = null) => {
    // First clear all auth data
    logoutUser();
    setUser(null);
    setToken('');
    
    // Clear any auth-related local storage that might have been missed
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    
    // Then navigate to landing page if navigate function is provided
    if (navigate) {
      navigate('/', { replace: true });
    }
  };
  
  return {
    logout
  };
};

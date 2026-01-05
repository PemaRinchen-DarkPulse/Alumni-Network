import { useState } from 'react';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Hook for handling user login functionality
 * @param {Function} setUser - Function to set user state after login
 * @param {Function} setToken - Function to set token state after login
 * @returns {Object} Object containing login functionality and state
 */
export const useLogin = (setUser, setToken) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  /**
   * Login a user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} Result of the login attempt
   */
  const login = async (email, password) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setUser(data.user);
        setToken(data.token);
        
        setLoading(false);
        return { success: true, user: data.user, token: data.token };
      } else {
        const errorMessage = data.message || 'Login failed';
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = 'Network error. Please check your connection and try again.';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };
  
  return {
    login,
    loading,
    error,
  };
};

import { useState } from 'react';
import { loginUser } from '../services/authService';

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
    
    const result = await loginUser(email, password);
    
    if (result.success) {
      // Update context state with the logged-in user and token
      setUser(result.user);
      setToken(result.token);
    } else {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
    return result;
  };
  
  return {
    login,
    loading,
    error,
  };
};

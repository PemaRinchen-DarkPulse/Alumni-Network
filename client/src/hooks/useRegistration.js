import { useState } from 'react';
import { registerUser } from '../services/authService';

/**
 * Hook for handling user registration functionality
 * @returns {Object} Object containing registration functionality and state
 */
export const useRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Result of the registration attempt
   */
  const register = async (userData) => {
    setLoading(true);
    setError('');
    
    const result = await registerUser(userData);
    
    if (!result.success) {
      setError(result.error || 'Registration failed');
    }
    
    setLoading(false);
    return result;
  };
  
  return {
    register,
    loading,
    error,
  };
};

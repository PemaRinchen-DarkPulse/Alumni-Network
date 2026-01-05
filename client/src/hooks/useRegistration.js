import { useState } from 'react';
import { API_ENDPOINTS } from '../utils/constants';

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
    
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setLoading(false);
        return { 
          success: true, 
          data: data.data,
          message: data.message 
        };
      } else {
        const errorMessage = data.message || 'Registration failed';
        setError(errorMessage);
        setLoading(false);
        return { 
          success: false, 
          error: errorMessage 
        };
      }
    } catch (err) {
      const errorMessage = 'Network error. Please check your connection and try again.';
      setError(errorMessage);
      setLoading(false);
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };
  
  return {
    register,
    loading,
    error,
  };
};

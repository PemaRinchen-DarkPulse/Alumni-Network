import { useState } from 'react';

/**
 * Hook for handling user registration functionality
 * @returns {Object} Object containing registration functionality and state
 */
export const useRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  /**
   * Register a new user (mock - no backend)
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Result of the registration attempt
   */
  const register = async (userData) => {
    setLoading(true);
    setError('');
    
    // Mock registration - no backend connection
    const result = { success: false, error: 'Backend removed - no registration available' };
    
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

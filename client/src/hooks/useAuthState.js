import { useState, useEffect } from 'react';
import { getCurrentUser, getAuthToken } from '../services/authService';

/**
 * Hook for managing authentication state
 * @returns {Object} Object containing auth state and setter functions
 */
export const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getAuthToken());
  const [loading, setLoading] = useState(true);
    // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Get token and user data from localStorage
        const storedToken = getAuthToken();
        const userData = getCurrentUser();
        
        // Validate both token and user data exist
        if (storedToken && userData) {
          setToken(storedToken);
          setUser(userData);
        } else {
          // If either is missing, clear both for consistency
          setToken('');
          setUser(null);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        setToken('');
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);
  
  return {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    setUser,
    setToken
  };
};

import { useState, useEffect } from 'react';

/**
 * Hook for managing authentication state
 * @returns {Object} Object containing auth state and setter functions
 */
export const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Get user data from localStorage
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          setToken('');
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        setToken('');
        setUser(null);
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

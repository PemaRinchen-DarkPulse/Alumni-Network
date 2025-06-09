import { useState, useEffect } from 'react';
import { getCurrentUser, getAuthToken } from '../services/authService';
import { isTokenValid, cleanupInvalidAuth } from '../utils/tokenUtils';

/**
 * Hook for managing authentication state
 * @returns {Object} Object containing auth state and setter functions
 */
export const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getAuthToken());
  const [loading, setLoading] = useState(true);  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Get token and user data from localStorage
        const storedToken = getAuthToken();
        const userData = getCurrentUser();
        
        // Validate both token and user data exist and token is valid
        if (storedToken && userData && isTokenValid(storedToken)) {
          setToken(storedToken);
          setUser(userData);
            // Sync with server to get latest user data (including profile picture and privacy settings)
          try {
            const { refreshUserData } = await import('../services/settingsService');
            const response = await refreshUserData();
            
            if (response.success && response.data.user) {
              const serverUser = response.data.user;          // Ensure privacy settings are included in the user object
              console.log('User data from server includes privacy settings:', 
                serverUser.privacySettings ? 'Yes' : 'No');
                
              // If user data didn't include privacy settings but we had them in localStorage,
              // preserve them to prevent losing settings during refresh
              if (!serverUser.privacySettings && userData.privacySettings) {
                console.log('Preserving privacy settings from localStorage as they were missing in server response');
                serverUser.privacySettings = userData.privacySettings;
              }
              
              // Update user state and localStorage
              setUser(serverUser);
              localStorage.setItem('user', JSON.stringify(serverUser));
            }
          } catch (syncError) {
            // If sync fails due to auth issues, clear everything
            if (syncError.message.includes('Authentication') || syncError.message.includes('Token')) {
              console.warn('Authentication failed during sync, clearing auth data');
              cleanupInvalidAuth();
              setToken('');
              setUser(null);
            } else {
              // If sync fails for other reasons, continue with localStorage data
              console.warn('Could not sync user data from server:', syncError);
            }
          }
        } else {
          // If token is invalid or missing, clear everything
          console.log('Invalid or missing authentication data, clearing...');
          cleanupInvalidAuth();
          setToken('');
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        cleanupInvalidAuth();
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

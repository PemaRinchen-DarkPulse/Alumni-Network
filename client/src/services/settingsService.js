// API service for user settings-related requests
import { isTokenValid, cleanupInvalidAuth } from '../utils/tokenUtils';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Helper to handle API responses
 * @param {Response} response - Fetch API response
 * @returns {Promise<Object>} - Parsed response data
 */
const handleResponse = async (response) => {
  const data = await response.json();
  
  // Handle 401 unauthorized errors specifically
  if (response.status === 401) {
    // Token might be expired or invalid
    console.error('Authentication failed - token may be expired');
    
    // Clear invalid token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login page
    if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
      window.location.href = '/login';
    }
    
    throw new Error('Authentication failed. Please login again.');
  }
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  return data;
};

/**
 * Get authenticated request headers
 * @returns {Object} - Headers with auth token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No authentication token found');
    throw new Error('No authentication token found. Please login again.');
  }
  
  // Validate token before using it
  if (!isTokenValid(token)) {
    console.error('Authentication token is invalid or expired');
    cleanupInvalidAuth();
    throw new Error('Authentication token has expired. Please login again.');
  }
  
  return {
    'Content-Type': 'application/json',
    'x-auth-token': token
  };
};

/**
 * Get user profile
 * @returns {Promise<Object>} - Response with success status and user data or error
 */
export const getUserProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    const data = await handleResponse(response);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Update user profile
 * @param {Object} profileData - User profile data
 * @returns {Promise<Object>} - Response with success status and data or error
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    
    const data = await handleResponse(response);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get user notification settings
 * @returns {Promise<Object>} - Response with success status and notification settings data or error
 */
export const getNotificationSettings = async () => {
  try {
    const response = await fetch(`${API_URL}/api/notifications`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    const data = await handleResponse(response);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Update user notification settings
 * @param {Object} notificationSettings - User notification settings
 * @returns {Promise<Object>} - Response with success status and data or error
 */
export const updateNotificationSettings = async (notificationSettings) => {
  try {
    const response = await fetch(`${API_URL}/api/notifications`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(notificationSettings),
    });
    
    const data = await handleResponse(response);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Reset notification settings to default
 * @returns {Promise<Object>} - Response with success status and data or error
 */
export const resetNotificationSettings = async () => {
  try {
    const response = await fetch(`${API_URL}/api/notifications/reset`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    const data = await handleResponse(response);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Update specific notification preference
 * @param {string} preference - Preference name
 * @param {boolean} value - Preference value
 * @returns {Promise<Object>} - Response with success status and data or error
 */
export const updateNotificationPreference = async (preference, value) => {
  try {
    const response = await fetch(`${API_URL}/api/notifications/preference`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ preference, value }),
    });
    
    const data = await handleResponse(response);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Update quiet hours settings
 * @param {Object} quietHours - Quiet hours configuration
 * @returns {Promise<Object>} - Response with success status and data or error
 */
export const updateQuietHours = async (quietHours) => {
  try {
    const response = await fetch(`${API_URL}/api/notifications/quiet-hours`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quietHours }),
    });
    
    const data = await handleResponse(response);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get user privacy settings
 * @returns {Promise<Object>} - Response with success status and privacy settings data or error
 */
export const getPrivacySettings = async () => {
  try {
    const response = await fetch(`${API_URL}/api/privacy`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    const data = await handleResponse(response);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Update user privacy settings
 * @param {Object} privacySettings - User privacy settings
 * @returns {Promise<Object>} - Response with success status and data or error
 */
export const updatePrivacySettings = async (privacySettings) => {
  try {
    const response = await fetch(`${API_URL}/api/privacy`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(privacySettings),
    });
    
    const data = await handleResponse(response);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Reset privacy settings to default
 * @returns {Promise<Object>} - Response with success status and data or error
 */
export const resetPrivacySettings = async () => {
  try {
    const response = await fetch(`${API_URL}/api/privacy/reset`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    const data = await handleResponse(response);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Update visibility preference
 * @param {string} preference - Preference name
 * @param {any} value - Preference value
 * @returns {Promise<Object>} - Response with success status and data or error
 */
export const updateVisibilityPreference = async (preference, value) => {
  try {
    const response = await fetch(`${API_URL}/api/privacy/visibility`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ preference, value }),
    });
    
    const data = await handleResponse(response);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Update user networking preferences (for Alumni)
 * @param {Object} networkingPreferences - Alumni networking preferences
 * @returns {Promise<Object>} - Response with success status and data or error
 */
export const updateNetworkingPreferences = async (networkingPreferences) => {
  try {
    const response = await fetch(`${API_URL}/api/users/settings/networking`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ networkingPreferences }),
    });
    
    const data = await handleResponse(response);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Change user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} - Response with success status and data or error
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/api/users/change-password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    
    const data = await handleResponse(response);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Toggle account status (activate/deactivate)
 * @param {string} status - 'active' or 'deactivated'
 * @returns {Promise<Object>} - Response with success status and data or error
 */
export const toggleAccountStatus = async (status) => {
  try {
    const response = await fetch(`${API_URL}/api/users/settings/account-status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    
    const data = await handleResponse(response);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Submit contact support request
 * @param {string} subject - Message subject
 * @param {string} message - Support message
 * @returns {Promise<Object>} - Response with success status and data or error
 */
export const contactSupport = async (subject, message) => {
  try {
    const response = await fetch(`${API_URL}/api/users/support/contact`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ subject, message }),
    });
    
    const data = await handleResponse(response);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Save mentor profile data
 * @param {Object} mentorProfile - Mentor profile information
 * @returns {Promise<Object>} - Response with success status and data or error
 */
export const saveMentorProfile = async (mentorProfile) => {
  try {
    const response = await fetch(`${API_URL}/api/users/mentor-profile`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(mentorProfile),
    });
    
    const data = await handleResponse(response);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get users directory for directory page
 * @param {Object} params - Query parameters (role, page, limit)
 * @returns {Promise<Object>} - Response with success status and users data or error
 */
export const getUsersDirectory = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add query parameters if provided
    if (params.role) queryParams.append('role', params.role);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const queryString = queryParams.toString();
    const url = `${API_URL}/api/users/directory${queryString ? '?' + queryString : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    const data = await handleResponse(response);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Add function to refresh user data from server
export const refreshUserData = async () => {
  try {
    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    // Use handleResponse helper to ensure consistent error handling
    const data = await handleResponse(response);

    // Add debug logs to track privacy settings
    if (data && data.user) {
      console.log('Refreshed user data from server - User ID:', data.user.id);
      console.log('Privacy settings included?', data.user.privacySettings ? 'Yes' : 'No');
      if (data.user.privacySettings) {
        console.log('Privacy settings profile visibility:', data.user.privacySettings.profileVisibility);
      }
      
      // Store updated user data in localStorage to ensure consistency
      if (data.user) {
        // Get existing user data to avoid overwriting other properties
        const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...existingUser, ...data.user };
        
        // Ensure privacy settings are properly included
        if (data.user.privacySettings) {
          updatedUser.privacySettings = data.user.privacySettings;
        }
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('Updated user data in localStorage with privacy settings');
      }
    } else {
      console.warn('Refreshed user data does not contain user object');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error refreshing user data:', error);
    return { success: false, error: error.message };
  }
};

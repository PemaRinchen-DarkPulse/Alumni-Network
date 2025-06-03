// API service for authentication-related requests
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Response with success status and data or error
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * User login
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Response with success status and user data or error
 */
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
      // Save user data and token to localStorage with security enhancements
    // Store token in localStorage (consider using httpOnly cookies in production)
    localStorage.setItem('token', data.token);
    
    // Don't store sensitive user data like password hash
    const safeUserData = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      batch: data.user.batch,
      emailVerified: true // User can only log in if verified
    };
    
    localStorage.setItem('user', JSON.stringify(safeUserData));
    
    return { success: true, user: safeUserData, token: data.token };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Resend verification email
 * @param {string} email - User's email
 * @returns {Promise<Object>} - Response with success status and message or error
 */
export const resendVerificationEmail = async (email) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to resend verification email');
    }
    
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Request password reset
 * @param {string} email - User's email
 * @returns {Promise<Object>} - Response with success status and message or error
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to process password reset request');
    }
    
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Reset password with token
 * @param {string} token - Reset password token
 * @param {string} password - New password
 * @returns {Promise<Object>} - Response with success status and message or error
 */
export const resetUserPassword = async (token, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/reset-password/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to reset password');
    }
    
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Validate password reset token
 * @param {string} token - Reset password token to validate
 * @returns {Promise<Object>} - Response with success status and email or error
 */
export const validateResetToken = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/validate-reset-token/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Invalid reset token');
    }
    
    return { success: true, email: data.email };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Clears user session from localStorage
 */
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Get current user from localStorage with validation
 * @returns {Object|null} User object or null if not found or invalid
 */
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    
    const user = JSON.parse(userData);
    
    // Validate user object has required fields
    if (!user || !user.id || !user.email) {
      console.warn('Invalid user data in localStorage');
      localStorage.removeItem('user'); // Clear invalid data
      localStorage.removeItem('token'); // Also clear token for security
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    localStorage.removeItem('user'); // Clear corrupted data
    localStorage.removeItem('token'); // Also clear token for security
    return null;
  }
};

/**
 * Get auth token from localStorage
 * @returns {string} Token or empty string if not found
 */
export const getAuthToken = () => {
  return localStorage.getItem('token') || '';
};

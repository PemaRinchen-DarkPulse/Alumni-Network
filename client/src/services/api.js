// API Service for making HTTP requests to backend
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Generic fetch wrapper with error handling
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 */
const apiFetch = async (url, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
    
    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };
    
    const response = await fetch(url, config);
    const data = await response.json();
    
    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    throw new Error('Network error. Please check your connection.');
  }
};

/**
 * Auth API methods
 */
export const authAPI = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   */
  register: async (userData) => {
    const { ok, data } = await apiFetch(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (ok && data.success) {
      return { success: true, data: data.data, message: data.message };
    } else {
      return { success: false, error: data.message || 'Registration failed' };
    }
  },
  
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   */
  login: async (email, password) => {
    const { ok, data } = await apiFetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (ok && data.success) {
      return { 
        success: true, 
        user: data.user, 
        token: data.token,
        message: data.message 
      };
    } else {
      return { success: false, error: data.message || 'Login failed' };
    }
  },
  
  /**
   * Verify email with token
   * @param {string} token - Verification token
   */
  verifyEmail: async (token) => {
    const { ok, data } = await apiFetch(
      `${API_ENDPOINTS.AUTH.VERIFY_EMAIL}?token=${token}`
    );
    
    if (ok && data.success) {
      return { success: true, message: data.message };
    } else {
      return { success: false, error: data.message || 'Verification failed' };
    }
  },
  
  /**
   * Resend verification email
   * @param {string} email - User email
   */
  resendVerification: async (email) => {
    const { ok, data } = await apiFetch(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    
    if (ok && data.success) {
      return { success: true, message: data.message };
    } else {
      return { success: false, error: data.message || 'Failed to resend verification' };
    }
  },
  
  /**
   * Request password reset
   * @param {string} email - User email
   */
  forgotPassword: async (email) => {
    const { ok, data } = await apiFetch(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    
    if (ok && data.success) {
      return { success: true, message: data.message };
    } else {
      return { success: false, error: data.message || 'Failed to process request' };
    }
  },
  
  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} password - New password
   */
  resetPassword: async (token, password) => {
    const { ok, data } = await apiFetch(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
    
    if (ok && data.success) {
      return { success: true, message: data.message };
    } else {
      return { success: false, error: data.message || 'Failed to reset password' };
    }
  },
  
  /**
   * Validate password reset token
   * @param {string} token - Reset token
   */
  validateResetToken: async (token) => {
    const { ok, data } = await apiFetch(
      `${API_ENDPOINTS.AUTH.VALIDATE_TOKEN}?token=${token}`
    );
    
    if (ok && data.success) {
      return { success: true };
    } else {
      return { success: false, error: data.message || 'Invalid token' };
    }
  },
};

export default authAPI;

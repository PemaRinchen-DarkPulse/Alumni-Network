import { useState } from 'react';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Hook for handling password reset and verification email functionality
 * @returns {Object} Object containing auth helpers functionality and state
 */
export const useAuthHelpers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  /**
   * Resend verification email
   * @param {string} email - User's email
   * @returns {Promise<Object>} Result of the verification email request
   */
  const resendVerification = async (email) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setLoading(false);
        return { success: true, message: data.message };
      } else {
        const errorMessage = data.message || 'Failed to resend verification email';
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Request password reset
   * @param {string} email - User's email
   * @returns {Promise<Object>} Result of the password reset request
   */
  const forgotPassword = async (email) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setLoading(false);
        return { success: true, message: data.message };
      } else {
        const errorMessage = data.message || 'Failed to process password reset request';
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Validate a password reset token
   * @param {string} token - The reset token to validate
   * @returns {Promise<Object>} Result of the token validation
   */
  const validatePasswordResetToken = async (token) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH.VALIDATE_TOKEN}?token=${token}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setLoading(false);
        return { success: true };
      } else {
        const errorMessage = data.message || 'Failed to validate reset token';
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Reset user password with token
   * @param {string} token - Reset token
   * @param {string} password - New password
   * @returns {Promise<Object>} Result of the password reset
   */
  const resetPassword = async (token, password) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setLoading(false);
        return { success: true, message: data.message };
      } else {
        const errorMessage = data.message || 'Failed to reset password';
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };
  
  return {
    resendVerification,
    forgotPassword,
    validatePasswordResetToken,
    resetPassword,
    loading,
    error,
  };
};

import { useState } from 'react';
import { 
  resendVerificationEmail, 
  requestPasswordReset, 
  validateResetToken, 
  resetUserPassword 
} from '../services/authService';

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
    
    const result = await resendVerificationEmail(email);
    
    if (!result.success) {
      setError(result.error || 'Failed to resend verification email');
    }
    
    setLoading(false);
    return result;
  };

  /**
   * Request password reset
   * @param {string} email - User's email
   * @returns {Promise<Object>} Result of the password reset request
   */
  const forgotPassword = async (email) => {
    setLoading(true);
    setError('');
    
    const result = await requestPasswordReset(email);
    
    if (!result.success) {
      setError(result.error || 'Failed to process password reset request');
    }
    
    setLoading(false);
    return result;
  };

  /**
   * Validate a password reset token
   * @param {string} token - The reset token to validate
   * @returns {Promise<Object>} Result of the token validation
   */
  const validatePasswordResetToken = async (token) => {
    setLoading(true);
    setError('');
    
    const result = await validateResetToken(token);
    
    if (!result.success) {
      setError(result.error || 'Failed to validate reset token');
    }
    
    setLoading(false);
    return result;
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
    
    const result = await resetUserPassword(token, password);
    
    if (!result.success) {
      setError(result.error || 'Failed to reset password');
    }
    
    setLoading(false);
    return result;
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

// AuthProvider.jsx - The main provider component
import React, { useState } from 'react';
import { useAuthState } from '../../hooks/useAuthState';
import { useRegistration } from '../../hooks/useRegistration';
import { useLogin } from '../../hooks/useLogin';
import { useLogout } from '../../hooks/useLogout';
import { useAuthHelpers } from '../../hooks/useAuthHelpers';
import AuthContext from './AuthContext';

/**
 * Auth provider component that encapsulates authentication state and functionality
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  // Get core auth state from useAuthState hook
  const { 
    user, 
    token, 
    loading: authStateLoading, 
    isAuthenticated, 
    setUser, 
    setToken 
  } = useAuthState();

  // State for tracking errors across different auth functions
  const [error, setError] = useState('');
  
  // Get user registration functionality from hook
  const { register, loading: registrationLoading } = useRegistration();
  
  // Get login functionality from hook
  const { login, loading: loginLoading } = useLogin(setUser, setToken);
  
  // Get logout functionality from hook
  const { logout } = useLogout(setUser, setToken);
  
  // Get auth helper functionalities from hook (password reset, email verification)
  const { 
    resendVerification,
    forgotPassword,
    resetPassword,
    validatePasswordResetToken: validateResetToken,
    loading: helpersLoading 
  } = useAuthHelpers();

  // Determine if any auth operation is loading
  const loading = authStateLoading || registrationLoading || loginLoading || helpersLoading;

  // Values to provide to components
  const contextValue = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    resendVerification,
    forgotPassword,
    resetPassword,
    validateResetToken,
    isAuthenticated,
    setError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // API URL from environment variables
  const API_URL = import.meta.env.VITE_API_URL;

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      if (token) {
        // In a real app, you might want to validate the token with the server
        try {
          // For now we'll just check if there's a user in localStorage
          const userData = JSON.parse(localStorage.getItem('user'));
          if (userData) {
            setUser(userData);
          } else {
            // If no user data, clear token
            localStorage.removeItem('token');
            setToken('');
          }
        } catch (error) {
          console.error('Error checking auth state:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken('');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, [token]);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError('');
    
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
      
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      setError(error.message || 'Registration failed');
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    setError('');
    
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
      
      // Save user data and token to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      setToken(data.token);
      setLoading(false);
      
      return { success: true };
    } catch (error) {
      setError(error.message || 'Login failed');
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken('');
  };

  // Resend verification email
  const resendVerification = async (email) => {
    setLoading(true);
    setError('');
    
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
      
      setLoading(false);
      return { success: true, message: data.message };
    } catch (error) {
      setError(error.message || 'Failed to resend verification email');
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // Forgot password request
  const forgotPassword = async (email) => {
    setLoading(true);
    setError('');
    
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
      
      setLoading(false);
      return { success: true, message: data.message };
    } catch (error) {
      setError(error.message || 'Failed to process password reset request');
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // Reset password with token
  const resetPassword = async (token, password) => {
    setLoading(true);
    setError('');
    
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
      
      setLoading(false);
      return { success: true, message: data.message };
    } catch (error) {
      setError(error.message || 'Failed to reset password');
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // Validate reset token
  const validateResetToken = async (token) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Validating reset token:', token);
      console.log('Using API URL:', API_URL);
      
      const response = await fetch(`${API_URL}/api/auth/validate-reset-token/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Reset token validation response status:', response.status);
      const data = await response.json();
      console.log('Reset token validation response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid reset token');
      }
      
      setLoading(false);
      return { success: true, email: data.email };
    } catch (error) {
      console.error('Token validation error:', error);
      setError(error.message || 'Failed to validate reset token');
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

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
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
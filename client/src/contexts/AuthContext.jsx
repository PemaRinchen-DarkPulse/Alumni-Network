import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiBaseUrl } from '@/lib/utils';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // API URL - Using the dynamic utility function
  const API_URL = getApiBaseUrl();

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
      console.log(`Registering with API URL: ${API_URL}/auth/register`);
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      console.log('Registration response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      console.error('Registration error:', error);
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
      console.log(`Login with API URL: ${API_URL}/auth/login`);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      console.log('Login response status:', response.status);
      
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
      console.error('Login error:', error);
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
      console.log(`Resending verification with API URL: ${API_URL}/auth/resend-verification`);
      
      const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      console.log('Resend verification response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend verification email');
      }
      
      setLoading(false);
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Resend verification error:', error);
      setError(error.message || 'Failed to resend verification email');
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
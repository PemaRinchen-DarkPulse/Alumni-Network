// useAuth.js - Custom hook for consuming the auth context
import { useContext } from 'react';
import AuthContext from './AuthContext';

/**
 * Custom hook for using auth context
 * @returns {Object} The auth context value
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

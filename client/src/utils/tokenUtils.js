/**
 * Token validation utilities
 */

/**
 * Check if a JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if token is expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Decode token without verification (just to check expiry)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

/**
 * Get token expiry time
 * @param {string} token - JWT token
 * @returns {Date|null} - Expiry date or null if invalid
 */
export const getTokenExpiry = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is valid and not expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if token is valid
 */
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // Basic format check (should have 3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Check if not expired
    return !isTokenExpired(token);
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

/**
 * Clean up invalid token and user data
 */
export const cleanupInvalidAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('Cleaned up invalid authentication data');
};

/**
 * Check authentication status and redirect if needed
 * @param {boolean} redirectToLogin - Whether to redirect to login page
 * @returns {boolean} - True if authenticated
 */
export const checkAuthStatus = (redirectToLogin = true) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user || isTokenExpired(token)) {
    cleanupInvalidAuth();
    
    if (redirectToLogin && window.location.pathname !== '/login' && window.location.pathname !== '/') {
      console.log('Authentication expired, redirecting to login');
      window.location.href = '/login';
    }
    
    return false;
  }
  
  return true;
};

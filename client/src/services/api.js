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

/**
 * User API methods
 */
export const userAPI = {
  /**
   * Get all users with optional filters
   * @param {Object} filters - Optional filters (role, batch, search, currentUserEmail)
   */
  getAllUsers: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.role) queryParams.append('role', filters.role);
    if (filters.batch) queryParams.append('batch', filters.batch);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.currentUserEmail) queryParams.append('currentUserEmail', filters.currentUserEmail);
    
    const url = `${API_ENDPOINTS.USERS.GET_ALL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const { ok, data } = await apiFetch(url);
    
    if (ok && data.success) {
      return { success: true, data: data.data, count: data.count };
    } else {
      return { success: false, error: data.message || 'Failed to fetch users' };
    }
  },
  
  /**
   * Get user by ID
   * @param {number} id - User ID
   */
  getUserById: async (id) => {
    const { ok, data } = await apiFetch(API_ENDPOINTS.USERS.GET_BY_ID(id));
    
    if (ok && data.success) {
      return { success: true, data: data.data };
    } else {
      return { success: false, error: data.message || 'Failed to fetch user' };
    }
  },
};

/**
 * Connection API methods
 */
export const connectionAPI = {
  /**
   * Send a connection request
   * @param {number} senderId - ID of the user sending the request
   * @param {number} receiverId - ID of the user receiving the request
   */
  sendConnectionRequest: async (senderId, receiverId) => {
    console.log('API: Sending connection request')
    console.log('API: senderId:', senderId, 'receiverId:', receiverId)
    const url = `${API_ENDPOINTS.CONNECTIONS.SEND_REQUEST}?senderId=${senderId}`
    console.log('API: Request URL:', url)
    console.log('API: Request body:', { receiverId })
    
    try {
      const { ok, data, status } = await apiFetch(url, {
        method: 'POST',
        body: JSON.stringify({ receiverId }),
      });
      
      console.log('API: Response status:', status)
      console.log('API: Response ok:', ok)
      console.log('API: Response data:', data)
      
      if (ok && data.success) {
        return { success: true, data: data.data, message: data.message };
      } else {
        return { success: false, error: data.message || 'Failed to send connection request' };
      }
    } catch (error) {
      console.error('API: Exception in sendConnectionRequest:', error)
      throw error
    }
  },
  
  /**
   * Accept a connection request
   * @param {number} connectionId - ID of the connection request
   * @param {number} userId - ID of the user accepting the request
   */
  acceptConnectionRequest: async (connectionId, userId) => {
    const { ok, data } = await apiFetch(
      `${API_ENDPOINTS.CONNECTIONS.ACCEPT_REQUEST(connectionId)}?userId=${userId}`,
      {
        method: 'POST',
      }
    );
    
    if (ok && data.success) {
      return { success: true, data: data.data, message: data.message };
    } else {
      return { success: false, error: data.message || 'Failed to accept connection request' };
    }
  },
  
  /**
   * Reject a connection request
   * @param {number} connectionId - ID of the connection request
   * @param {number} userId - ID of the user rejecting the request
   */
  rejectConnectionRequest: async (connectionId, userId) => {
    const { ok, data } = await apiFetch(
      `${API_ENDPOINTS.CONNECTIONS.REJECT_REQUEST(connectionId)}?userId=${userId}`,
      {
        method: 'POST',
      }
    );
    
    if (ok && data.success) {
      return { success: true, data: data.data, message: data.message };
    } else {
      return { success: false, error: data.message || 'Failed to reject connection request' };
    }
  },
  
  /**
   * Withdraw a sent connection request
   * @param {number} connectionId - ID of the connection request
   * @param {number} userId - ID of the user withdrawing the request
   */
  withdrawConnectionRequest: async (connectionId, userId) => {
    const { ok, data } = await apiFetch(
      `${API_ENDPOINTS.CONNECTIONS.WITHDRAW_REQUEST(connectionId)}?userId=${userId}`,
      {
        method: 'POST',
      }
    );
    
    if (ok && data.success) {
      return { success: true, data: data.data, message: data.message };
    } else {
      return { success: false, error: data.message || 'Failed to withdraw connection request' };
    }
  },
  
  /**
   * Get pending connection requests received by a user
   * @param {number} userId - User ID
   */
  getPendingRequestsReceived: async (userId) => {
    const { ok, data } = await apiFetch(
      `${API_ENDPOINTS.CONNECTIONS.GET_PENDING_RECEIVED}?userId=${userId}`
    );
    
    if (ok && data.success) {
      return { success: true, data: data.data, count: data.count };
    } else {
      return { success: false, error: data.message || 'Failed to fetch pending requests' };
    }
  },
  
  /**
   * Get pending connection requests sent by a user
   * @param {number} userId - User ID
   */
  getPendingRequestsSent: async (userId) => {
    const { ok, data } = await apiFetch(
      `${API_ENDPOINTS.CONNECTIONS.GET_PENDING_SENT}?userId=${userId}`
    );
    
    if (ok && data.success) {
      return { success: true, data: data.data, count: data.count };
    } else {
      return { success: false, error: data.message || 'Failed to fetch sent requests' };
    }
  },
  
  /**
   * Get accepted connections for a user
   * @param {number} userId - User ID
   */
  getAcceptedConnections: async (userId) => {
    const { ok, data } = await apiFetch(
      `${API_ENDPOINTS.CONNECTIONS.GET_ACCEPTED}?userId=${userId}`
    );
    
    if (ok && data.success) {
      return { success: true, data: data.data, count: data.count };
    } else {
      return { success: false, error: data.message || 'Failed to fetch connections' };
    }
  },
  
  /**
   * Get connection status between two users
   * @param {number} userId1 - First user ID
   * @param {number} userId2 - Second user ID
   */
  getConnectionStatus: async (userId1, userId2) => {
    const { ok, data } = await apiFetch(
      `${API_ENDPOINTS.CONNECTIONS.GET_STATUS}?userId1=${userId1}&userId2=${userId2}`
    );
    
    if (ok && data.success) {
      return { success: true, status: data.status };
    } else {
      return { success: false, error: data.message || 'Failed to fetch connection status' };
    }
  },
};

export default authAPI;

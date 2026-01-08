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

/**
 * Mentorship API methods
 */
export const mentorshipAPI = {
  /**
   * Save mentorship profile as draft
   * @param {Object} profileData - Mentorship profile data
   */
  saveDraft: async (profileData) => {
    const { ok, data } = await apiFetch(API_ENDPOINTS.MENTORSHIP.SAVE_DRAFT, {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
    
    if (ok && data.success) {
      return { success: true, data: data.data, message: data.message };
    } else {
      return { success: false, error: data.message || 'Failed to save draft' };
    }
  },

  /**
   * Publish mentorship profile
   * @param {Object} profileData - Mentorship profile data
   */
  publish: async (profileData) => {
    const { ok, data } = await apiFetch(API_ENDPOINTS.MENTORSHIP.PUBLISH, {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
    
    if (ok && data.success) {
      return { success: true, data: data.data, message: data.message };
    } else {
      return { success: false, error: data.message || 'Failed to publish profile' };
    }
  },

  /**
   * Get mentorship profile by user ID
   * @param {number} userId - User ID
   */
  getProfile: async (userId) => {
    const { ok, data } = await apiFetch(API_ENDPOINTS.MENTORSHIP.GET_PROFILE(userId));
    
    if (ok && data.success) {
      return { success: true, data: data.data };
    } else {
      return { success: false, error: data.message || 'Failed to fetch profile' };
    }
  },

  /**
   * Update mentorship profile
   * @param {number} userId - User ID
   * @param {Object} profileData - Updated profile data
   */
  updateProfile: async (userId, profileData) => {
    const { ok, data } = await apiFetch(API_ENDPOINTS.MENTORSHIP.UPDATE(userId), {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    
    if (ok && data.success) {
      return { success: true, data: data.data, message: data.message };
    } else {
      return { success: false, error: data.message || 'Failed to update profile' };
    }
  },

  /**
   * Get all published mentors with optional filters
   * @param {Object} filters - Optional filters (expertise, topic, search, currentUserId)
   */
  getAllMentors: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.expertise) queryParams.append('expertise', filters.expertise);
    if (filters.topic) queryParams.append('topic', filters.topic);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.currentUserId) queryParams.append('currentUserId', filters.currentUserId);
    
    const url = `${API_ENDPOINTS.MENTORSHIP.GET_ALL_MENTORS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const { ok, data } = await apiFetch(url);
    
    if (ok && data.success) {
      return { success: true, data: data.data, count: data.count };
    } else {
      return { success: false, error: data.message || 'Failed to fetch mentors' };
    }
  },

  /**
   * Create a mentorship request
   * @param {Object} requestData - Request data (menteeId, mentorId, message)
   */
  createRequest: async (requestData) => {
    const { ok, data } = await apiFetch(API_ENDPOINTS.MENTORSHIP.CREATE_REQUEST, {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
    
    if (ok && data.success) {
      return { success: true, data: data.data, message: data.message };
    } else {
      return { success: false, error: data.message || 'Failed to send mentorship request' };
    }
  },

  /**
   * Get mentorship requests for a mentee
   * @param {number} menteeId - Mentee user ID
   */
  getMenteeRequests: async (menteeId) => {
    const { ok, data } = await apiFetch(API_ENDPOINTS.MENTORSHIP.GET_MENTEE_REQUESTS(menteeId));
    
    if (ok && data.success) {
      return { success: true, data: data.data, count: data.count };
    } else {
      return { success: false, error: data.message || 'Failed to fetch requests' };
    }
  },

  /**
   * Get mentorship requests for a mentor
   * @param {number} mentorId - Mentor user ID
   * @param {string} status - Optional status filter
   */
  getMentorRequests: async (mentorId, status = null) => {
    const url = status 
      ? `${API_ENDPOINTS.MENTORSHIP.GET_MENTOR_REQUESTS(mentorId)}?status=${status}`
      : API_ENDPOINTS.MENTORSHIP.GET_MENTOR_REQUESTS(mentorId);
    
    const { ok, data } = await apiFetch(url);
    
    if (ok && data.success) {
      return { success: true, data: data.data, count: data.count };
    } else {
      return { success: false, error: data.message || 'Failed to fetch requests' };
    }
  },

  /**
   * Update mentorship request status
   * @param {number} requestId - Request ID
   * @param {string} status - New status (ACCEPTED, REJECTED, CANCELLED)
   */
  updateRequestStatus: async (requestId, status) => {
    const { ok, data } = await apiFetch(API_ENDPOINTS.MENTORSHIP.UPDATE_REQUEST_STATUS(requestId), {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    
    if (ok && data.success) {
      return { success: true, data: data.data, message: data.message };
    } else {
      return { success: false, error: data.message || 'Failed to update request status' };
    }
  },
};

/**
 * Event API methods
 */
export const eventAPI = {
  /**
   * Save event as draft
   * @param {Object} eventData - Event data
   */
  saveDraft: async (eventData) => {
    const { ok, data } = await apiFetch(API_ENDPOINTS.EVENTS.SAVE_DRAFT, {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
    
    if (ok && data.success) {
      return { success: true, data: data.data, message: data.message };
    } else {
      return { success: false, error: data.message || 'Failed to save event draft' };
    }
  },

  /**
   * Publish event
   * @param {Object} eventData - Event data
   */
  publishEvent: async (eventData) => {
    const { ok, data } = await apiFetch(API_ENDPOINTS.EVENTS.PUBLISH, {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
    
    if (ok && data.success) {
      return { success: true, data: data.data, message: data.message };
    } else {
      return { success: false, error: data.message || 'Failed to publish event' };
    }
  },

  /**
   * Get all published events
   */
  getAllEvents: async () => {
    const { ok, data } = await apiFetch(API_ENDPOINTS.EVENTS.GET_ALL);
    
    if (ok && data.success) {
      return { success: true, data: data.data, count: data.count };
    } else {
      return { success: false, error: data.message || 'Failed to fetch events' };
    }
  },

  /**
   * Get upcoming events
   */
  getUpcomingEvents: async () => {
    const { ok, data } = await apiFetch(API_ENDPOINTS.EVENTS.GET_UPCOMING);
    
    if (ok && data.success) {
      return { success: true, data: data.data, count: data.count };
    } else {
      return { success: false, error: data.message || 'Failed to fetch upcoming events' };
    }
  },

  /**
   * Get event by ID
   * @param {number} id - Event ID
   */
  getEventById: async (id) => {
    const { ok, data } = await apiFetch(API_ENDPOINTS.EVENTS.GET_BY_ID(id));
    
    if (ok && data.success) {
      return { success: true, data: data.data };
    } else {
      return { success: false, error: data.message || 'Failed to fetch event' };
    }
  },

  /**
   * Get events by creator
   * @param {number} userId - User ID
   */
  getEventsByCreator: async (userId) => {
    const { ok, data } = await apiFetch(API_ENDPOINTS.EVENTS.GET_BY_CREATOR(userId));
    
    if (ok && data.success) {
      return { success: true, data: data.data, count: data.count };
    } else {
      return { success: false, error: data.message || 'Failed to fetch events' };
    }
  },

  /**
   * Get latest draft for user
   * @param {number} userId - User ID
   */
  getLatestDraft: async (userId) => {
    const { ok, data } = await apiFetch(`${API_ENDPOINTS.EVENTS.GET_BY_CREATOR(userId).replace('/creator/', '/draft/latest/')}`);
    
    if (ok && data.success) {
      return { success: true, data: data.data };
    } else {
      return { success: false, error: data.message || 'Failed to fetch draft' };
    }
  },

  /**
   * Update event
   * @param {number} id - Event ID
   * @param {Object} eventData - Updated event data
   */
  updateEvent: async (id, eventData) => {
    const { ok, data } = await apiFetch(API_ENDPOINTS.EVENTS.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
    
    if (ok && data.success) {
      return { success: true, data: data.data, message: data.message };
    } else {
      return { success: false, error: data.message || 'Failed to update event' };
    }
  },

  /**
   * Delete event
   * @param {number} id - Event ID
   */
  deleteEvent: async (id) => {
    const { ok, data } = await apiFetch(API_ENDPOINTS.EVENTS.DELETE(id), {
      method: 'DELETE',
    });
    
    if (ok && data.success) {
      return { success: true, message: data.message };
    } else {
      return { success: false, error: data.message || 'Failed to delete event' };
    }
  },
};

export default authAPI;

// API Configuration
export const API_BASE_URL = 'http://localhost:8080/api';
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
    RESEND_VERIFICATION: `${API_BASE_URL}/auth/resend-verification`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    VALIDATE_TOKEN: `${API_BASE_URL}/auth/validate-reset-token`,
  },
  USERS: {
    GET_ALL: `${API_BASE_URL}/users`,
    GET_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
  },
  CONNECTIONS: {
    SEND_REQUEST: `${API_BASE_URL}/connections/send`,
    ACCEPT_REQUEST: (id) => `${API_BASE_URL}/connections/${id}/accept`,
    REJECT_REQUEST: (id) => `${API_BASE_URL}/connections/${id}/reject`,
    WITHDRAW_REQUEST: (id) => `${API_BASE_URL}/connections/${id}/withdraw`,
    GET_PENDING_RECEIVED: `${API_BASE_URL}/connections/pending/received`,
    GET_PENDING_SENT: `${API_BASE_URL}/connections/pending/sent`,
    GET_ACCEPTED: `${API_BASE_URL}/connections/accepted`,
    GET_STATUS: `${API_BASE_URL}/connections/status`,
  },
  MENTORSHIP: {
    SAVE_DRAFT: `${API_BASE_URL}/mentorship/draft`,
    PUBLISH: `${API_BASE_URL}/mentorship/publish`,
    GET_PROFILE: (userId) => `${API_BASE_URL}/mentorship/profile/${userId}`,
    UPDATE: (userId) => `${API_BASE_URL}/mentorship/profile/${userId}`,
    GET_ALL_MENTORS: `${API_BASE_URL}/mentorship/mentors`,
    CREATE_REQUEST: `${API_BASE_URL}/mentorship/request`,
    GET_MENTEE_REQUESTS: (menteeId) => `${API_BASE_URL}/mentorship/requests/mentee/${menteeId}`,
    GET_MENTOR_REQUESTS: (mentorId) => `${API_BASE_URL}/mentorship/requests/mentor/${mentorId}`,
    UPDATE_REQUEST_STATUS: (requestId) => `${API_BASE_URL}/mentorship/requests/${requestId}/status`,
  },
};

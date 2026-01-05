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
};

import axios from 'axios';

// Create an axios instance with default configuration
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // This is needed if you're using cookies for authentication
});

// Make sure our client-side baseURL is correct for use elsewhere
console.log('API Base URL:', instance.defaults.baseURL);

// Add a request interceptor to add auth token to requests
instance.interceptors.request.use(
  config => {
    // Get token from localStorage or wherever it's stored in your app
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
instance.interceptors.response.use(
  response => response,
  error => {
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        // Handle unauthorized error (e.g., redirect to login)
        // This would be implemented based on your auth flow
        console.error('Unauthorized access. Please log in again.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if it's an authentication endpoint or if explicitly unauthorized
    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/api/auth/')
      const currentPath = window.location.pathname
      
      // Don't redirect if already on login/signup page
      if (currentPath !== '/login' && currentPath !== '/signup') {
        // Only clear storage and redirect for auth endpoint failures
        // or if the error message indicates token expiration
        if (isAuthEndpoint || error.response?.data?.message?.toLowerCase().includes('token')) {
          console.warn('Authentication failed, redirecting to login')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient

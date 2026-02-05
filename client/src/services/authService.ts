import apiClient from '../config/api'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  token?: string
  user?: {
    id: number
    email: string
    firstName: string
    lastName: string
    role: string
  }
}

export interface RegistrationRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber?: string
  batch?: string
  program?: string
  currentCompany?: string
  currentPosition?: string
  linkedInUrl?: string
}

export interface RegistrationResponse {
  success: boolean
  message: string
  user?: any
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/api/auth/login', credentials)
    return response.data
  },

  register: async (data: RegistrationRequest): Promise<RegistrationResponse> => {
    const response = await apiClient.post('/api/auth/register', data)
    return response.data
  },

  verifyEmail: async (token: string) => {
    const response = await apiClient.get(`/api/auth/verify-email?token=${token}`)
    return response.data
  },

  resendVerification: async (email: string) => {
    const response = await apiClient.post('/api/auth/resend-verification', { email })
    return response.data
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/api/auth/forgot-password', { email })
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

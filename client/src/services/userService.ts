import apiClient from '../config/api'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  batch?: string
  program?: string
  currentCompany?: string
  currentPosition?: string
  linkedInUrl?: string
  bio?: string
  profilePictureUrl?: string
}

export const userService = {
  getAllUsers: async (filters?: {
    role?: string
    batch?: string
    search?: string
    currentUserEmail?: string
  }) => {
    const params = new URLSearchParams()
    if (filters?.role) params.append('role', filters.role)
    if (filters?.batch) params.append('batch', filters.batch)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.currentUserEmail) params.append('currentUserEmail', filters.currentUserEmail)

    const response = await apiClient.get(`/api/users?${params.toString()}`)
    return response.data
  },

  getUserById: async (id: number) => {
    const response = await apiClient.get(`/api/users/${id}`)
    return response.data
  },
}

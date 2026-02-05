import apiClient from '../config/api'

export interface MentorshipProfile {
  id: number
  userId: number
  role: 'MENTOR' | 'MENTEE' | 'BOTH'
  availability: string
  expertiseAreas: string[]
  areasOfInterest: string[]
  bio: string
  yearsOfExperience?: number
  status: 'DRAFT' | 'PUBLISHED'
}

export interface MentorshipRequest {
  id: number
  mentorId: number
  menteeId: number
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED'
  message: string
  createdAt: string
}

export const mentorshipService = {
  saveDraft: async (profileData: any) => {
    const response = await apiClient.post('/api/mentorship/draft', profileData)
    return response.data
  },

  publishProfile: async (profileData: any) => {
    const response = await apiClient.post('/api/mentorship/publish', profileData)
    return response.data
  },

  getProfile: async (userId: number) => {
    const response = await apiClient.get(`/api/mentorship/profile/${userId}`)
    return response.data
  },

  updateProfile: async (userId: number, profileData: any) => {
    const response = await apiClient.put(`/api/mentorship/profile/${userId}`, profileData)
    return response.data
  },

  deleteProfile: async (userId: number) => {
    const response = await apiClient.delete(`/api/mentorship/profile/${userId}`)
    return response.data
  },

  getAllMentors: async (filters?: {
    expertiseArea?: string
    availability?: string
    yearsOfExperience?: number
  }) => {
    const params = new URLSearchParams()
    if (filters?.expertiseArea) params.append('expertiseArea', filters.expertiseArea)
    if (filters?.availability) params.append('availability', filters.availability)
    if (filters?.yearsOfExperience) params.append('yearsOfExperience', filters.yearsOfExperience.toString())

    const response = await apiClient.get(`/api/mentorship/mentors?${params.toString()}`)
    return response.data
  },

  sendMentorshipRequest: async (requestData: {
    mentorId: number
    menteeId: number
    message: string
  }) => {
    const response = await apiClient.post('/api/mentorship/request', requestData)
    return response.data
  },

  acceptRequest: async (requestId: number) => {
    const response = await apiClient.post(`/api/mentorship/request/${requestId}/accept`)
    return response.data
  },

  rejectRequest: async (requestId: number) => {
    const response = await apiClient.post(`/api/mentorship/request/${requestId}/reject`)
    return response.data
  },

  getUserRequests: async (userId: number, type: 'sent' | 'received') => {
    const response = await apiClient.get(`/api/mentorship/requests/${userId}/${type}`)
    return response.data
  },
}

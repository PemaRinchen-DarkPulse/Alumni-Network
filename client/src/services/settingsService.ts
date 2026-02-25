import apiClient from '../config/api'

export interface UserSettings {
  account?: {
    fullName: string
    email: string
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
    timeZone: string
    profilePhoto?: string
  }
  privacy?: {
    profileVisibility: string
    showEmail: boolean
    showPhone: boolean
    canMessageMe: string
    canSendConnectionRequests: string
  }
  notifications?: {
    emailNotifications: {
      messages: boolean
      mentorshipRequests: boolean
      eventReminders: boolean
    }
    inAppNotifications: {
      mentions: boolean
      announcements: boolean
    }
    digestFrequency: string
  }
  appearance?: {
    language: string
    theme: string
    dateFormat: string
  }
  mentorship?: {
    mentorshipStatus: string
    expertiseAreas: string[]
    preferredMenteeLevel: string
    availability: string
    sessionFormat: string[]
  }
  professional?: {
    currentRole: string
    organization: string
    industry: string
    skills: string[]
    willingToHelp: string[]
  }
  teaching?: {
    academicExpertise: string[]
    mentorshipAvailability: boolean
    studentLevelPreference: string
  }
  moderation?: {
    receiveReportedContentAlerts: boolean
    approveMentorshipRequests: boolean
    canPinPosts: boolean
  }
  learning?: {
    lookingFor: string[]
    preferredMentors: string[]
    topicsOfInterest: string[]
  }
  career?: {
    industriesOfInterest: string[]
    locationPreference: string
    openToOpportunities: boolean
  }
}

export const settingsService = {
  getUserSettings: async (): Promise<UserSettings> => {
    try {
      const response = await apiClient.get('/api/settings')
      return response.data
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      throw error
    }
  },

  updateSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    try {
      const response = await apiClient.put('/api/settings', settings)
      return response.data
    } catch (error) {
      console.error('Failed to update settings:', error)
      throw error
    }
  },

  updatePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      await apiClient.post('/api/settings/password', {
        currentPassword,
        newPassword
      })
    } catch (error) {
      console.error('Failed to update password:', error)
      throw error
    }
  },

  uploadProfilePhoto: async (file: File): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await apiClient.post('/api/settings/profile-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data.photoUrl
    } catch (error) {
      console.error('Failed to upload photo:', error)
      throw error
    }
  },

  deactivateAccount: async (): Promise<void> => {
    try {
      await apiClient.post('/api/settings/deactivate')
    } catch (error) {
      console.error('Failed to deactivate account:', error)
      throw error
    }
  },

  getBlockedUsers: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get('/api/settings/blocked-users')
      return response.data
    } catch (error) {
      console.error('Failed to fetch blocked users:', error)
      throw error
    }
  },

  blockUser: async (userId: number): Promise<void> => {
    try {
      await apiClient.post(`/api/settings/block-user/${userId}`)
    } catch (error) {
      console.error('Failed to block user:', error)
      throw error
    }
  },

  unblockUser: async (userId: number): Promise<void> => {
    try {
      await apiClient.delete(`/api/settings/unblock-user/${userId}`)
    } catch (error) {
      console.error('Failed to unblock user:', error)
      throw error
    }
  }
}

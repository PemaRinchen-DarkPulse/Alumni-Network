import apiClient from '../config/api'

export interface Connection {
  id: number
  sender: {
    id: number
    firstName: string
    lastName: string
    email: string
  }
  receiver: {
    id: number
    firstName: string
    lastName: string
    email: string
  }
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: string
}

export const connectionService = {
  sendConnectionRequest: async (senderId: number, receiverId: number) => {
    const response = await apiClient.post(
      `/api/connections/send?senderId=${senderId}`,
      { receiverId }
    )
    return response.data
  },

  acceptConnectionRequest: async (connectionId: number, userId: number) => {
    const response = await apiClient.post(
      `/api/connections/${connectionId}/accept?userId=${userId}`
    )
    return response.data
  },

  rejectConnectionRequest: async (connectionId: number, userId: number) => {
    const response = await apiClient.post(
      `/api/connections/${connectionId}/reject?userId=${userId}`
    )
    return response.data
  },

  getUserConnections: async (userId: number, status?: string) => {
    const params = status ? `?status=${status}` : ''
    const response = await apiClient.get(`/api/connections/user/${userId}${params}`)
    return response.data
  },

  getPendingRequests: async (userId: number) => {
    const response = await apiClient.get(`/api/connections/user/${userId}/pending`)
    return response.data
  },

  getConnectionStats: async (userId: number) => {
    const response = await apiClient.get(`/api/connections/user/${userId}/stats`)
    return response.data
  },

  removeConnection: async (connectionId: number, userId: number) => {
    const response = await apiClient.delete(
      `/api/connections/${connectionId}?userId=${userId}`
    )
    return response.data
  },
}

import apiClient from '../config/api'

export interface Event {
  id: number
  title: string
  description: string
  eventDate: string
  location: string
  capacity: number
  registeredCount: number
  eventType: string
  organizerId: number
  organizerName: string
  imageUrl?: string
  isRegistered?: boolean
}

export const eventService = {
  getAllEvents: async (params?: {
    eventType?: string
    startDate?: string
    endDate?: string
    userId?: number
  }) => {
    const queryParams = new URLSearchParams()
    if (params?.eventType) queryParams.append('eventType', params.eventType)
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)
    if (params?.userId) queryParams.append('userId', params.userId.toString())

    const response = await apiClient.get(`/api/events?${queryParams.toString()}`)
    return response.data
  },

  getEventById: async (id: number, userId?: number) => {
    const params = userId ? `?userId=${userId}` : ''
    const response = await apiClient.get(`/api/events/${id}${params}`)
    return response.data
  },

  createEvent: async (eventData: any) => {
    const response = await apiClient.post('/api/events', eventData)
    return response.data
  },

  updateEvent: async (id: number, eventData: any) => {
    const response = await apiClient.put(`/api/events/${id}`, eventData)
    return response.data
  },

  deleteEvent: async (id: number) => {
    const response = await apiClient.delete(`/api/events/${id}`)
    return response.data
  },

  rsvpToEvent: async (eventId: number) => {
    const response = await apiClient.post(`/api/events/${eventId}/rsvp`)
    return response.data
  },

  cancelRsvp: async (eventId: number) => {
    const response = await apiClient.delete(`/api/events/${eventId}/rsvp`)
    return response.data
  },

  getUserRegisteredEvents: async (userId: number) => {
    const response = await apiClient.get(`/api/events/user/${userId}/registered`)
    return response.data
  },
}

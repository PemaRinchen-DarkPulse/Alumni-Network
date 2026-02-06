import api from '../config/api'

export interface TributeData {
  teacherName: string
  department: string
  subject: string
  yearsFrom: string
  yearsTo: string
  message: string
  authorId: number
  authorName: string
}

export interface Tribute {
  id: number
  teacherName: string
  department: string
  subject: string
  yearsFrom: string
  yearsTo: string
  message: string
  authorId: number
  authorName: string
  likeCount: number
  status: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

const tributeService = {
  // Create a new tribute
  createTribute: async (tributeData: TributeData): Promise<Tribute> => {
    const response = await api.post('/api/tributes', tributeData)
    return response.data.data
  },

  // Get all published tributes
  getAllPublishedTributes: async (): Promise<Tribute[]> => {
    const response = await api.get('/api/tributes/published')
    return response.data.data
  },

  // Get all pending tributes (admin/teacher only)
  getAllPendingTributes: async (): Promise<Tribute[]> => {
    const response = await api.get('/api/tributes/pending')
    return response.data.data
  },

  // Get a single tribute by ID
  getTributeById: async (id: number): Promise<Tribute> => {
    const response = await api.get(`/api/tributes/${id}`)
    return response.data.data
  },

  // Get tributes by author
  getTributesByAuthor: async (authorId: number): Promise<Tribute[]> => {
    const response = await api.get(`/api/tributes/author/${authorId}`)
    return response.data.data
  },

  // Search tributes by teacher name
  searchTributesByTeacherName: async (teacherName: string): Promise<Tribute[]> => {
    const response = await api.get(`/api/tributes/search?teacherName=${encodeURIComponent(teacherName)}`)
    return response.data.data
  },

  // Get tributes by department
  getTributesByDepartment: async (department: string): Promise<Tribute[]> => {
    const response = await api.get(`/api/tributes/department/${department}`)
    return response.data.data
  },

  // Update a tribute
  updateTribute: async (id: number, tributeData: TributeData): Promise<Tribute> => {
    const response = await api.put(`/api/tributes/${id}`, tributeData)
    return response.data.data
  },

  // Publish a tribute (admin/teacher only)
  publishTribute: async (id: number): Promise<Tribute> => {
    const response = await api.patch(`/api/tributes/${id}/publish`)
    return response.data.data
  },

  // Like a tribute
  likeTribute: async (id: number): Promise<Tribute> => {
    const response = await api.post(`/api/tributes/${id}/like`)
    return response.data.data
  },

  // Unlike a tribute
  unlikeTribute: async (id: number): Promise<Tribute> => {
    const response = await api.delete(`/api/tributes/${id}/like`)
    return response.data.data
  },

  // Delete a tribute (admin/teacher only)
  deleteTribute: async (id: number): Promise<void> => {
    await api.delete(`/api/tributes/${id}`)
  }
}

export default tributeService

import apiClient from '../config/api'

export interface BlogPost {
  id: number
  title: string
  content: string
  authorId: number
  authorName: string
  createdAt: string
  updatedAt: string
  category: string
  tags: string[]
  imageUrl?: string
}

export const blogService = {
  getAllPosts: async (params?: {
    category?: string
    authorId?: number
    search?: string
  }) => {
    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.append('category', params.category)
    if (params?.authorId) queryParams.append('authorId', params.authorId.toString())
    if (params?.search) queryParams.append('search', params.search)

    const response = await apiClient.get(`/api/blog?${queryParams.toString()}`)
    return response.data
  },

  getPostById: async (id: number) => {
    const response = await apiClient.get(`/api/blog/${id}`)
    return response.data
  },

  createPost: async (postData: any) => {
    const response = await apiClient.post('/api/blog', postData)
    return response.data
  },

  updatePost: async (id: number, postData: any) => {
    const response = await apiClient.put(`/api/blog/${id}`, postData)
    return response.data
  },

  deletePost: async (id: number) => {
    const response = await apiClient.delete(`/api/blog/${id}`)
    return response.data
  },
}

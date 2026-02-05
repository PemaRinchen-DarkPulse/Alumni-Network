import apiClient from '../config/api'

export interface BlogPost {
  id: number
  title: string
  content: string
  authorId: number
  authorName: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  category: string
  tags: string[]
  imageUrl?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  viewCount: number
  likeCount: number
  commentCount: number
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

    const response = await apiClient.get(`/api/blog/published?${queryParams.toString()}`)
    return response.data.data || response.data
  },

  getPostById: async (id: number) => {
    const response = await apiClient.get(`/api/blog/${id}`)
    return response.data.data || response.data
  },

  createPost: async (postData: any) => {
    const endpoint = postData.status === 'PUBLISHED' ? '/api/blog/publish' : '/api/blog/draft'
    const response = await apiClient.post(endpoint, postData)
    return response.data.data || response.data
  },

  updatePost: async (id: number, postData: any) => {
    const response = await apiClient.put(`/api/blog/${id}`, postData)
    return response.data.data || response.data
  },

  deletePost: async (id: number) => {
    const response = await apiClient.delete(`/api/blog/${id}`)
    return response.data.data || response.data
  },
}

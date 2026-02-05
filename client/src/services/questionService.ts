import apiClient from '../config/api'

export interface QuestionData {
  title: string
  description: string
  category: string
  tags: string[]
  isAnonymous: boolean
  authorId: number
  authorName: string
}

export interface Question {
  id: number
  title: string
  description: string
  category: string
  tags: string[]
  authorId?: number
  authorName: string
  isAnonymous: boolean
  status: string
  viewCount: number
  answerCount: number
  upvoteCount: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export const questionService = {
  saveDraft: async (questionData: QuestionData): Promise<Question> => {
    const response = await apiClient.post('/api/questions/draft', questionData)
    return response.data.data
  },

  publishQuestion: async (questionData: QuestionData): Promise<Question> => {
    const response = await apiClient.post('/api/questions/publish', questionData)
    return response.data.data
  },

  getAllQuestions: async (): Promise<Question[]> => {
    const response = await apiClient.get('/api/questions')
    return response.data.data
  },

  getQuestionsByCategory: async (category: string): Promise<Question[]> => {
    const response = await apiClient.get(`/api/questions/category/${category}`)
    return response.data.data
  },

  getUserQuestions: async (userId: number): Promise<Question[]> => {
    const response = await apiClient.get(`/api/questions/user/${userId}`)
    return response.data.data
  },

  getPopularQuestions: async (): Promise<Question[]> => {
    const response = await apiClient.get('/api/questions/popular')
    return response.data.data
  },

  getUnansweredQuestions: async (): Promise<Question[]> => {
    const response = await apiClient.get('/api/questions/unanswered')
    return response.data.data
  },

  getQuestionById: async (id: number): Promise<Question> => {
    const response = await apiClient.get(`/api/questions/${id}`)
    return response.data.data
  },

  deleteQuestion: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/questions/${id}`)
  }
}

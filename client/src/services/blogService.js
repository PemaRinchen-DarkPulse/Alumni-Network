import axios from './axiosConfig';

/**
 * Service for blog-related API calls
 */
const blogService = {
  /**
   * Get all blog posts with pagination
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 10)
   * @returns {Promise<Object>} Blog posts and pagination data
   */
  getAllPosts: async (page = 1, limit = 10) => {
    const response = await axios.get(`/api/blog?page=${page}&limit=${limit}`);
    return response.data;
  },

  /**
   * Get a blog post by ID
   * @param {string} postId - Blog post ID
   * @returns {Promise<Object>} Blog post data
   */
  getPostById: async (postId) => {
    const response = await axios.get(`/api/blog/${postId}`);
    return response.data;
  },

/**
 * Create a new blog post
 * @param {Object} postData - Blog post data
 * @returns {Promise<Object>} Created blog post
 */
createPost: async (postData) => {
  const response = await axios.post('/api/blog', postData);
  return response.data;
},

/**
 * Create a new blog post with image upload
 * @param {FormData} formData - Form data with blog post info and image file
 * @returns {Promise<Object>} Created blog post
 */
createPostWithImage: async (formData) => {
  // Skip axios interceptors and make a direct fetch request instead
  // This avoids the content-type header issues that occur with axios and FormData
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No authentication token found');
      throw new Error('Authentication required');
    }
    
    console.log('Making direct fetch request for image upload');
    
    const response = await fetch(`${axios.defaults.baseURL}/api/blog/with-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Note: Do NOT set Content-Type for FormData with fetch - it will set the correct boundary
      },
      body: formData,
      credentials: 'include' // Include credentials
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Server error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating post with image:', error);
    throw error;
  }
},  /**
   * Update an existing blog post
   * @param {string} postId - Blog post ID
   * @param {Object} postData - Updated blog post data
   * @returns {Promise<Object>} Updated blog post
   */
  updatePost: async (postId, postData) => {
    const response = await axios.put(`/api/blog/${postId}`, postData);
    return response.data;
  },

  /**
   * Update an existing blog post with image
   * @param {string} postId - Blog post ID
   * @param {FormData} formData - Form data with blog post info and image file
   * @returns {Promise<Object>} Updated blog post
   */
  updatePostWithImage: async (postId, formData) => {
    // Skip axios interceptors and make a direct fetch request instead
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found for update');
        throw new Error('Authentication required');
      }
      
      console.log('Making direct fetch request for image update');
      
      const response = await fetch(`${axios.defaults.baseURL}/api/blog/${postId}/with-image`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Note: Do NOT set Content-Type for FormData with fetch - it will set the correct boundary
        },
        body: formData,
        credentials: 'include' // Include credentials
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Server error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating post with image:', error);
      throw error;
    }
  },

  /**
   * Delete a blog post
   * @param {string} postId - Blog post ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deletePost: async (postId) => {
    const response = await axios.delete(`/api/blog/${postId}`);
    return response.data;
  },

  /**
   * Add a comment to a blog post
   * @param {string} postId - Blog post ID
   * @param {string} content - Comment content
   * @returns {Promise<Object>} Updated blog post with new comment
   */
  addComment: async (postId, content) => {
    const response = await axios.post(`/api/blog/${postId}/comments`, { content });
    return response.data;
  },

  /**
   * Delete a comment from a blog post
   * @param {string} postId - Blog post ID
   * @param {string} commentId - Comment ID
   * @returns {Promise<Object>} Updated blog post without the deleted comment
   */
  deleteComment: async (postId, commentId) => {
    const response = await axios.delete(`/api/blog/${postId}/comments/${commentId}`);
    return response.data;
  }
};

export default blogService;

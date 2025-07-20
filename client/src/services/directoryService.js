import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookie-based authentication
});

/**
 * Get all alumni users
 * @param {string} [excludeUserId] - Optional user ID to exclude from results
 * @returns {Promise<Object>} Response with alumni data
 */
export const getAllAlumni = async (excludeUserId) => {
  try {
    let url = '/api/alumni';
    
    // If an ID is provided to exclude, add it as a query parameter
    if (excludeUserId) {
      url += `?exclude=${excludeUserId}`;
    }
    
    const response = await apiClient.get(url);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching alumni directory:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch alumni directory'
    };
  }
};

/**
 * Get alumni user by ID
 * @param {string} alumniId - The ID of the alumni to retrieve
 * @returns {Promise<Object>} Response with alumni data
 */
export const getAlumniById = async (alumniId) => {
  try {
    const response = await apiClient.get(`/api/alumni/${alumniId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error(`Error fetching alumni with ID ${alumniId}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch alumni'
    };
  }
};

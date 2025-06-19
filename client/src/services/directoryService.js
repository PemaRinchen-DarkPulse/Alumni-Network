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
 * @returns {Promise<Object>} Response with alumni data
 */
export const getAllAlumni = async () => {
  try {
    const response = await apiClient.get('/api/alumni');
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

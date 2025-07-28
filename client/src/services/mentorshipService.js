const API_URL = import.meta.env.VITE_API_URL;

/**
 * Get authenticated request headers
 * @returns {Object} - Headers with auth token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found. Please login again.');
  }
  
  return {
    'Content-Type': 'application/json',
    'x-auth-token': token
  };
};

/**
 * Handle API response
 * @param {Response} response - Fetch response object
 * @returns {Promise<Object>} - Parsed response data
 */
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  
  return data;
};

/**
 * Get all subjects
 * @returns {Promise<Object>} - Response with subjects data
 */
export const getSubjects = async () => {
  try {
    const response = await fetch(`${API_URL}/api/mentorship/subjects`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    const data = await handleResponse(response);
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get mentors by subject
 * @param {string} subject - Subject name
 * @returns {Promise<Object>} - Response with mentors data
 */
export const getMentorsBySubject = async (subject) => {
  try {
    const response = await fetch(`${API_URL}/api/mentorship/subjects/mentors/${encodeURIComponent(subject)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    const data = await handleResponse(response);
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

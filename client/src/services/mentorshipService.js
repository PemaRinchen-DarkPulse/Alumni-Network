import axios from './axiosConfig';

/**
 * Get all subjects
 * @returns {Promise<Object>} - Response with subjects data
 */
export const getSubjects = async () => {
  try {
    const response = await axios.get('/api/mentorship/subjects');
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

/**
 * Get mentors by subject
 * @param {string} subjectId - The subject ID to filter mentors by
 * @returns {Promise<Object>} - Response with mentors data
 */
export const getMentorsBySubject = async (subjectId) => {
  try {
    const response = await axios.get(`/api/mentorship/mentors/subject/${subjectId}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

/**
 * Create a new mentorship request
 * @param {Object} requestData - The mentorship request data
 * @param {string} requestData.mentorId - The mentor ID
 * @param {string} requestData.subjectId - The subject ID
 * @param {string} requestData.reason - The reason for the request
 * @param {string} requestData.goals - The goals and expectations
 * @returns {Promise<Object>} - Response with request data
 */
export const createMentorshipRequest = async (requestData) => {
  try {
    const response = await axios.post('/api/mentorship/request', requestData);
    return { success: true, data: response.data.data, message: response.data.message };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

/**
 * Get mentorship requests for mentor grouped by subject
 * @returns {Promise<Object>} - Response with requests data
 */
export const getMentorshipRequestsForMentor = async () => {
  try {
    const response = await axios.get('/api/mentorship/requests/mentor');
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

/**
 * Get accepted mentorships for student
 * @returns {Promise<Object>} - Response with mentorships data
 */
export const getAcceptedMentorshipsForStudent = async () => {
  try {
    const response = await axios.get('/api/mentorship/student/mentorships');
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

/**
 * Get all mentorship requests for student (all statuses)
 * @returns {Promise<Object>} - Response with request history data
 */
export const getMentorshipRequestsForStudent = async () => {
  try {
    const response = await axios.get('/api/mentorship/student/requests');
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

/**
 * Get accepted mentorships for alumni (as mentor)
 * @returns {Promise<Object>} - Response with mentorships data
 */
export const getAcceptedMentorshipsForMentor = async () => {
  try {
    const response = await axios.get('/api/mentorship/mentor/mentorships');
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

/**
 * Update mentorship request status (accept/reject)
 * @param {string} requestId - The mentorship request ID
 * @param {string} status - The new status ('accepted' or 'rejected')
 * @returns {Promise<Object>} - Response with updated request data
 */
export const updateMentorshipRequestStatus = async (requestId, status) => {
  try {
    const response = await axios.patch(`/api/mentorship/request/${requestId}/status`, { status });
    return { success: true, data: response.data.data, message: response.data.message };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

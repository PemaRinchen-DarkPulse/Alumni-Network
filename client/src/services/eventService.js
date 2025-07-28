import axios from './axiosConfig';

const eventService = {
  getAllEvents: () => {
    return axios.get('/api/events');
  },
  
  getEventById: (eventId) => {
    return axios.get(`/api/events/${eventId}`);
  },
  
  createEvent: (formData) => {
    // If formData is already created, we can send it directly
    return axios.post('/api/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  updateEvent: (eventId, formData) => {
    // If formData is already created, we can send it directly
    return axios.put(`/api/events/${eventId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteEvent: (eventId) => {
    return axios.delete(`/api/events/${eventId}`);
  },
  
  registerForEvent: (eventId, userData) => {
    return axios.post(`/api/events/${eventId}/register`, userData);
  },
};

export default eventService;

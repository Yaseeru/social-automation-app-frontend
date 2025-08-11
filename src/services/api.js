import axios from 'axios';

// Set the base URL for your backend API
const API = axios.create({
  baseURL: 'http://localhost:3001/api'
});

// A function to set the JWT for all future requests
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
};

// Functions to interact with your backend routes
export const getScheduledPosts = () => API.get('/posts');
export const schedulePost = (postData) => API.post('/posts', postData);
export const getGeneralTrends = (geo) => API.get('/trends/general', { params: { geo } });
export const generatePostContent = (trend) => API.post('/posts/generate', { trend });
export const getAnalyticsInsights = () => API.get('/analytics/insights');
export const uploadAnalyticsFile = (formData) => API.post('/analytics/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const getUserPreferences = () => API.get('/preferences');
export const updateUserPreferences = (preferences) => API.put('/preferences', preferences);
export const autocreatePost = (data) => API.post('/posts/autocreate', data);

// Exporting the API instance for other uses
export default API;

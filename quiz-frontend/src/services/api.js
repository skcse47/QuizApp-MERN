import axios from 'axios';

const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

// Helper function to convert relative media URLs to absolute URLs
export const getFullMediaUrl = (relativeUrl) => {
  if (!relativeUrl) return '';
  if (relativeUrl.startsWith('http')) return relativeUrl;
  return `${BASE_URL}${relativeUrl}`;
};

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL
});

// Add request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Quiz API calls
export const quizApi = {
  // Get all quizzes
  getAllQuizzes: () => api.get('/quizzes'),
  
  // Get quiz by ID
  getQuizById: (id) => api.get(`/quizzes/${id}`),
  
  // Create a new quiz (Admin only)
  createQuiz: (quizData) => api.post('/quizzes', quizData),
  
  // Upload media file for quiz questions
  uploadMedia: (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return api.post('/quizzes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

// Submission API calls
export const submissionApi = {
  // Submit quiz answers
  submitQuiz: (quizId, answers) => api.post(`/submissions/${quizId}/submit`, { answers }),
  
  // Get user's submissions
  getUserSubmissions: () => api.get('/submissions/my')
};

export default api;

import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Clear auth token
const clearAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

// Request interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (expired token)
    if (error.response && error.response.status === 401) {
      // If not on login or register page, clear token and redirect
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API Helper functions
const apiService = {
  setAuthToken,
  clearAuthToken,
  
  // Auth endpoints
  login: (credentials) => api.post('/api/login', credentials),
  register: (userData) => api.post('/api/register', userData),
  getCurrentUser: () => api.get('/api/me'),
  
  // Companies endpoints
  getUserCompanies: () => api.get('/api/user/companies'),
  getCompany: (companyId) => api.get(`/api/companies/${companyId}`),
  createCompany: (companyData) => api.post('/api/companies', companyData),
  addDataSharingTerm: (companyId, termData) => api.post(`/api/companies/${companyId}/terms`, termData),
  
  // Preferences endpoints
  getPreferences: (params) => api.get('/api/preferences', { params }),
  setPreference: (preferenceData) => api.post('/api/preferences', preferenceData),
  updatePreference: (preferenceId, data) => api.put(`/api/preferences/${preferenceId}`, data),
  clonePreferences: (sourceId, targetId) => api.post('/api/preferences/clone', {
    source_company_id: sourceId,
    target_company_id: targetId
  }),
  
  // Search endpoints
  searchCompanies: (query, limit = 10) => api.get('/api/search/companies', {
    params: { q: query, limit }
  }),
  
  // Generic methods
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  delete: (url, config) => api.delete(url, config)
};

export default apiService; 
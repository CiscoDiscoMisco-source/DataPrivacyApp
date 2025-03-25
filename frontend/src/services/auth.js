import ApiService from './api';

/**
 * Authentication service for the Data Privacy App
 * Handles login, registration, token management, and user sessions
 */

// Local storage keys
const ACCESS_TOKEN_KEY = 'dp_access_token';
const REFRESH_TOKEN_KEY = 'dp_refresh_token';
const USER_KEY = 'dp_user';

// Helper for handling API errors
const handleApiError = (error) => {
  // Try to extract a meaningful message
  let message = 'Authentication failed. Please try again.';
  
  if (error.message) {
    if (error.message.includes('504')) {
      message = 'The server is not responding. Please check if the backend is running.';
    } else if (error.message.includes('401')) {
      message = 'Invalid email or password. Please try again.';
    } else if (error.message.includes('409')) {
      message = 'A user with this email already exists.';
    } else if (error.message.includes('400')) {
      message = 'Please check your form data and try again.';
    } else {
      // Use the error message from the API if available
      message = error.message;
    }
  }
  
  throw new Error(message);
};

// Helper to store user session data
const storeUserSession = (response) => {
  if (response && response.access_token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token || '');
    localStorage.setItem(USER_KEY, JSON.stringify(response.user || {}));
    return true;
  }
  return false;
};

// Authentication service
const AuthService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - Registration response
   */
  register: async (userData) => {
    try {
      const response = await ApiService.post('/auth/register', userData);
      storeUserSession(response);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  /**
   * Log in an existing user
   * @param {Object} credentials - User login credentials
   * @returns {Promise<Object>} - Login response
   */
  login: async (credentials) => {
    try {
      const response = await ApiService.post('/auth/login', credentials);
      storeUserSession(response);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  /**
   * Log out the current user
   */
  logout: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  
  /**
   * Get the current user's data
   * @returns {Object|null} - Current user data or null if not logged in
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },
  
  /**
   * Check if a user is currently logged in
   * @returns {boolean} - True if user is logged in
   */
  isLoggedIn: () => !!localStorage.getItem(ACCESS_TOKEN_KEY),
  
  /**
   * Get the current access token
   * @returns {string|null} - Current access token or null
   */
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  
  /**
   * Refresh the access token using the refresh token
   * @returns {Promise<Object>} - Token refresh response
   */
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) throw new Error('No refresh token available');
      
      const response = await ApiService.post('/auth/refresh', { refresh_token: refreshToken });
      
      if (response && response.access_token) {
        localStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
      }
      
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

export default AuthService; 
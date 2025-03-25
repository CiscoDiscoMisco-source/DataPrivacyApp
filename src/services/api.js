/**
 * API Service for Data Privacy App
 * Handles all communication with the backend
 */

const API_BASE_URL = '/api/v1';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('dp_access_token');
};

// Helper to build headers with authentication
const buildHeaders = (customHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...customHeaders
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Send a GET request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise<any>} - Response data
 */
export const get = async (endpoint, params = {}) => {
  const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
  
  // Add query parameters
  Object.keys(params).forEach(key => {
    url.searchParams.append(key, params[key]);
  });
  
  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: buildHeaders(),
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Send a POST request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @returns {Promise<any>} - Response data
 */
export const post = async (endpoint, data = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: buildHeaders(),
      credentials: 'include',
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API error details:', {
        status: response.status,
        statusText: response.statusText,
        endpoint,
        errorData
      });
      throw new Error(errorData.message || `API error: ${response.status} - ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Send a PUT request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @returns {Promise<any>} - Response data
 */
export const put = async (endpoint, data = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: buildHeaders(),
      credentials: 'include',
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Send a DELETE request to the API
 * @param {string} endpoint - API endpoint
 * @returns {Promise<any>} - Response data
 */
export const del = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: buildHeaders(),
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

const ApiService = {
  get,
  post,
  put,
  delete: del
};

export default ApiService; 
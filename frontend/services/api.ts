/**
 * API Service for Data Privacy App
 * Handles all communication with the backend
 */

const API_BASE_URL = '/api';
const API_VERSION = 'v1';

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

interface RequestParams {
  [key: string]: string | number | boolean;
}

interface RequestHeaders {
  [key: string]: string;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('dp_access_token');
  }
  return null;
};

// Helper to build headers with authentication
const buildHeaders = (customHeaders: RequestHeaders = {}): RequestHeaders => {
  const headers: RequestHeaders = {
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

// Helper to build API URL with version
const buildApiUrl = (endpoint: string): string => {
  // Don't add version prefix if endpoint already includes it or if it's a special endpoint
  if (endpoint.includes('/v1/') || endpoint === '/health') {
    return `${API_BASE_URL}${endpoint}`;
  }
  return `${API_BASE_URL}/${API_VERSION}${endpoint}`;
};

// Helper to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('API error details:', {
      status: response.status,
      statusText: response.statusText,
      errorData
    });
    throw new Error(errorData.message || `API error: ${response.status} - ${response.statusText}`);
  }
  
  return await response.json() as T;
};

/**
 * Send a GET request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise<T>} - Response data
 */
export const get = async <T>(endpoint: string, params: RequestParams = {}): Promise<T> => {
  if (typeof window === 'undefined') {
    return Promise.resolve([] as unknown as T);
  }
  
  const url = new URL(buildApiUrl(endpoint), window.location.origin);
  
  // Add query parameters
  Object.keys(params).forEach(key => {
    url.searchParams.append(key, String(params[key]));
  });
  
  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: buildHeaders(),
      credentials: 'include'
    });
    
    return await handleResponse<T>(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Send a POST request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @returns {Promise<T>} - Response data
 */
export const post = async <T>(endpoint: string, data: Record<string, any> = {}): Promise<T> => {
  if (typeof window === 'undefined') {
    return Promise.resolve({} as T);
  }
  
  try {
    const response = await fetch(buildApiUrl(endpoint), {
      method: 'POST',
      headers: buildHeaders(),
      credentials: 'include',
      body: JSON.stringify(data)
    });
    
    return await handleResponse<T>(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Send a PUT request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @returns {Promise<T>} - Response data
 */
export const put = async <T>(endpoint: string, data: Record<string, any> = {}): Promise<T> => {
  if (typeof window === 'undefined') {
    return Promise.resolve({} as T);
  }
  
  try {
    const response = await fetch(buildApiUrl(endpoint), {
      method: 'PUT',
      headers: buildHeaders(),
      credentials: 'include',
      body: JSON.stringify(data)
    });
    
    return await handleResponse<T>(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Send a DELETE request to the API
 * @param {string} endpoint - API endpoint
 * @returns {Promise<T>} - Response data
 */
export const del = async <T>(endpoint: string): Promise<T> => {
  if (typeof window === 'undefined') {
    return Promise.resolve({} as T);
  }
  
  try {
    const response = await fetch(buildApiUrl(endpoint), {
      method: 'DELETE',
      headers: buildHeaders(),
      credentials: 'include'
    });
    
    return await handleResponse<T>(response);
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
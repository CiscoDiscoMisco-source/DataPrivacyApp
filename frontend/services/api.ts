/**
 * API Service for Data Privacy App
 * Handles all communication with the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const API_VERSION = 'v1';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('dp_access_token');
  }
  return null;
};

// Helper to build headers with authentication
const buildHeaders = (customHeaders: Record<string, string> = {}): Record<string, string> => {
  const headers: Record<string, string> = {
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
  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured');
  }

  // Don't add version prefix if endpoint already includes it or if it's a special endpoint
  if (endpoint.startsWith('/')) {
    // Ensure endpoint starts with a slash for consistency
    if (endpoint === '/health') {
      return `${API_BASE_URL}${endpoint}`;
    } else if (endpoint.startsWith('/v1/')) {
      return `${API_BASE_URL}${endpoint}`;
    } else {
      return `${API_BASE_URL}/${API_VERSION}${endpoint}`;
    }
  } else {
    // If endpoint doesn't start with slash, add one
    return `${API_BASE_URL}/${API_VERSION}/${endpoint}`;
  }
};

// Helper to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch (e) {
      // Response wasn't valid JSON
      console.error('Could not parse error response as JSON');
    }
    
    console.error('API error details:', {
      status: response.status,
      statusText: response.statusText,
      errorData
    });
    
    // Safely access errorData.message
    const errorMessage = errorData && typeof errorData === 'object' && 'message' in errorData 
      ? errorData.message 
      : `API error: ${response.status} - ${response.statusText}`;
      
    throw new Error(errorMessage);
  }
  
  return await response.json() as T;
};

// Generic request function to reduce duplication
const request = async <T>(
  method: string,
  endpoint: string,
  data?: Record<string, any>,
  params?: Record<string, string>
): Promise<T> => {
  // Skip API calls during server-side rendering
  if (typeof window === 'undefined') {
    return Promise.resolve((method === 'GET' ? [] : {}) as unknown as T);
  }
  
  const url = new URL(buildApiUrl(endpoint), window.location.origin);
  
  // Add query parameters for GET requests
  if (params && Object.keys(params).length > 0) {
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });
  }
  
  const options: RequestInit = {
    method,
    headers: buildHeaders(),
    credentials: 'include'
  };
  
  // Add body for non-GET requests
  if (method !== 'GET' && data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url.toString(), options);
    return await handleResponse<T>(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Send a GET request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise<T>} - Response data
 */
export const get = <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => 
  request<T>('GET', endpoint, undefined, params);

/**
 * Send a POST request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @returns {Promise<T>} - Response data
 */
export const post = <T>(endpoint: string, data: Record<string, any> = {}): Promise<T> => 
  request<T>('POST', endpoint, data);

/**
 * Send a PUT request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @returns {Promise<T>} - Response data
 */
export const put = <T>(endpoint: string, data: Record<string, any> = {}): Promise<T> => 
  request<T>('PUT', endpoint, data);

/**
 * Send a DELETE request to the API
 * @param {string} endpoint - API endpoint
 * @returns {Promise<T>} - Response data
 */
export const del = <T>(endpoint: string): Promise<T> => 
  request<T>('DELETE', endpoint);

const ApiService = {
  get,
  post,
  put,
  delete: del
};

export default ApiService; 
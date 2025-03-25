/**
 * API Service for Data Privacy App
 * Handles all communication with the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const API_VERSION = 'v1';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('dp_access_token');
  }
  return null;
};

// Helper function to get the current user ID from local storage
const getCurrentUserId = (): string | null => {
  if (typeof window !== 'undefined') {
    // Try to get from localStorage first
    const userId = localStorage.getItem('dp_user_id');
    if (userId) return userId;
    
    // If not in localStorage, try to parse from JWT token
    const token = getAuthToken();
    if (token) {
      try {
        // Extract payload from JWT (second part between dots)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        // Store in localStorage for future use
        if (payload.sub) {
          localStorage.setItem('dp_user_id', payload.sub);
          return payload.sub;
        }
      } catch (e) {
        console.error('Failed to parse user ID from token:', e);
      }
    }
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
    console.error('API_BASE_URL is not configured. Check your .env file for NEXT_PUBLIC_API_URL or NEXT_PUBLIC_SUPABASE_URL');
    throw new Error('API configuration missing');
  }

  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Remove any trailing slashes from the base URL
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  
  // Special endpoints that don't need versioning
  if (cleanEndpoint === 'health' || cleanEndpoint.startsWith('auth/')) {
    return `${baseUrl}/${cleanEndpoint}`;
  }
  
  // Add version prefix for all other endpoints
  return `${baseUrl}/${API_VERSION}/${cleanEndpoint}`;
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

// Helper function to handle API errors
const handleApiError = (error: any, endpoint: string): Error => {
  // Log error with context for debugging
  console.error(`API Error (${endpoint}):`, error);
  
  // Network errors (like CORS, server down, etc)
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    console.error(`Network error accessing ${endpoint}. Check API server status and CORS configuration.`);
    return new Error('Unable to connect to the server. Please check your network connection and try again.');
  }
  
  // Improve user-facing error messages
  if (error instanceof Error) {
    // Add more context to error for easier debugging
    error.message = `API Error (${endpoint}): ${error.message}`;
  }
  
  return error;
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
  
  // Build the complete URL directly rather than using window.location.origin
  const url = new URL(buildApiUrl(endpoint));
  
  // Add query parameters for GET requests
  if (params && Object.keys(params).length > 0) {
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });
  }
  
  const options: RequestInit = {
    method,
    headers: buildHeaders(),
    credentials: 'include',
    mode: 'cors'
  };
  
  // Add body for non-GET requests with user_id for RLS compatibility
  if (method !== 'GET' && data) {
    // Only add user_id for endpoints that need it (companies, preferences, etc.)
    const needsUserId = endpoint.includes('companies') || 
                        endpoint.includes('preferences') || 
                        endpoint.includes('settings');
                      
    if (needsUserId && !data.user_id) {
      const userId = getCurrentUserId();
      if (userId) {
        data = { ...data, user_id: userId };
      }
    }
    
    options.body = JSON.stringify(data);
  }
  
  try {
    console.log(`API ${method} request to: ${url.toString()}`);
    const response = await fetch(url.toString(), options);
    return await handleResponse<T>(response);
  } catch (error) {
    throw handleApiError(error, endpoint);
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
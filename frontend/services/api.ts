/**
 * API Service for Data Privacy App
 * Handles all communication with the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const API_VERSION = 'v1';

// Maximum number of retry attempts for failed requests
const MAX_RETRIES = 3;
// Delay between retries in milliseconds (starting value)
const RETRY_DELAY = 1000;
// Connection status tracking
let isOnline = true;
let lastConnectionCheck = 0;

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

// Helper function to check if the network/backend is reachable
const checkConnection = async (): Promise<boolean> => {
  // Skip if we've checked recently (within the last 10 seconds)
  const now = Date.now();
  if (now - lastConnectionCheck < 10000) {
    return isOnline;
  }
  
  lastConnectionCheck = now;
  
  try {
    // First try to reach Supabase directly since it's our auth provider
    const supabaseHealthEndpoint = `${API_BASE_URL}/health`;
    console.log('Checking Supabase health at:', supabaseHealthEndpoint);
    
    let response = await fetch(supabaseHealthEndpoint, {
      method: 'GET',
      headers: { 
        'Accept': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`
      },
      mode: 'cors',
      // Increase timeout to 5 seconds for better reliability
      signal: AbortSignal.timeout(5000)
    });
    
    // Update connection status
    if (response.ok) {
      isOnline = true;
      console.log('Supabase health check successful');
      
      // Now try the backend API health check endpoint if different from Supabase
      if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL !== API_BASE_URL) {
        try {
          const apiHealthEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/health`;
          console.log('Checking backend API health at:', apiHealthEndpoint);
          
          response = await fetch(apiHealthEndpoint, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            mode: 'cors',
            signal: AbortSignal.timeout(5000)
          });
          
          if (!response.ok) {
            console.warn(`Backend API health check failed with status ${response.status}`);
            isOnline = false;
          } else {
            console.log('Backend API health check successful');
          }
        } catch (backendError) {
          console.warn('Backend API health check failed:', backendError);
          isOnline = false;
        }
      }
    } else {
      isOnline = false;
      console.warn(`Supabase health endpoint returned status ${response.status}`);
    }
  } catch (error) {
    isOnline = false;
    console.warn('Failed to reach Supabase health endpoint:', error);
    // Log more details about the error
    if (error instanceof TypeError) {
      console.warn('Network error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
  }
  
  // Dispatch connection status event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('api:connectionchange', { 
      detail: { online: isOnline } 
    }));
  }
  
  return isOnline;
};

// Helper to build headers with authentication
const buildHeaders = (customHeaders: Record<string, string> = {}): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...customHeaders
  };
  
  // Always include the Supabase anon key as apikey
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (anonKey) {
    headers['apikey'] = anonKey;
  }
  
  // Then add auth token if available
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (anonKey) {
    // Use anon key for unauthenticated requests
    headers['Authorization'] = `Bearer ${anonKey}`;
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
  if (cleanEndpoint === 'health') {
    return `${baseUrl}/${cleanEndpoint}`;
  }
  
  // Auth endpoints need the /api/v1 prefix
  if (cleanEndpoint.startsWith('auth/')) {
    return `${baseUrl}/api/${API_VERSION}/${cleanEndpoint}`;
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

// Helper function to delay execution
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
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

// Generic request function with retry logic
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
  
  // Check connection status before proceeding
  const isConnectionAvailable = await checkConnection();
  if (!isConnectionAvailable && !endpoint.includes('health')) {
    throw new Error('No network connection available. Please check your internet connection and try again.');
  }
  
  // Build the complete URL directly rather than using window.location.origin
  const url = new URL(buildApiUrl(endpoint));
  
  // Add query parameters for GET requests
  if (params && Object.keys(params).length > 0) {
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });
  }
  
  // Implement retry logic for transient errors
  let attempts = 0;
  let lastError: Error | null = null;
  
  while (attempts < MAX_RETRIES) {
    try {
      // Increase delay with each retry attempt (exponential backoff)
      if (attempts > 0) {
        const delay = RETRY_DELAY * Math.pow(2, attempts - 1);
        console.log(`Retrying request to ${endpoint} (Attempt ${attempts + 1}/${MAX_RETRIES}) after ${delay}ms delay...`);
        await sleep(delay);
      }
      
      attempts++;
      
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
      
      console.log(`API ${method} request to: ${url.toString()}`);
      const response = await fetch(url.toString(), options);
      
      // If we get here, the request was successful
      isOnline = true;
      return await handleResponse<T>(response);
    } catch (error: any) {
      lastError = error;
      
      // Don't retry for client errors (4xx)
      if (error.message && error.message.includes('API error: 4')) {
        break;
      }
      
      // Don't retry for validation errors
      if (error.message && (
        error.message.includes('validation') || 
        error.message.includes('invalid') ||
        error.message.includes('not found')
      )) {
        break;
      }
      
      // Continue retrying for network errors and server errors (5xx)
      if (attempts >= MAX_RETRIES) {
        console.error(`Request to ${endpoint} failed after ${MAX_RETRIES} attempts.`);
        break;
      }
    }
  }
  
  throw handleApiError(lastError!, endpoint);
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

/**
 * Check if the API is currently reachable
 * @returns {Promise<boolean>} - True if API is reachable
 */
export const checkApiHealth = (): Promise<boolean> => checkConnection();

const ApiService = {
  get,
  post,
  put,
  delete: del,
  checkHealth: checkApiHealth
};

export default ApiService; 
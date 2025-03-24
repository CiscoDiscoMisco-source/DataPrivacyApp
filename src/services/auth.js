import apiClient from './api';

export const authService = {
  async login(email, password) {
    const response = await apiClient.post('/api/auth/login', { email, password });
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('refreshToken', response.data.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  async register(firstName, lastName, email, password, birthdate, nationalId) {
    const userData = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    };
    
    // Only add optional fields if they exist
    if (birthdate) userData.birthdate = birthdate;
    if (nationalId) userData.national_id = nationalId;
    
    const response = await apiClient.post('/api/auth/register', userData);
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('refreshToken', response.data.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  async logout() {
    try {
      // Attempt to invalidate the token on the server
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear local storage regardless of server response
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  async getCurrentUser() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      return JSON.parse(userJson);
    }
    
    try {
      const response = await apiClient.get('/api/auth/me');
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return false;
    }
    
    try {
      const response = await apiClient.post('/api/auth/refresh', {}, {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      });
      localStorage.setItem('token', response.data.access_token);
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }
};

export default authService; 
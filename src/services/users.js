import apiClient from './api';

export const usersService = {
  async getAll() {
    const response = await apiClient.get('/api/users');
    return response.data.users;
  },

  async getById(id) {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data.user;
  },

  async create(userData) {
    const response = await apiClient.post('/api/users', userData);
    return response.data.user;
  },

  async update(id, userData) {
    const response = await apiClient.put(`/api/users/${id}`, userData);
    return response.data.user;
  },

  async delete(id) {
    const response = await apiClient.delete(`/api/users/${id}`);
    return response.data;
  },

  async updateRole(id, role) {
    const response = await apiClient.put(`/api/users/${id}/role`, { role });
    return response.data.user;
  },

  async searchUsers(query) {
    const response = await apiClient.get(`/api/search/users?q=${encodeURIComponent(query)}`);
    return response.data.results;
  },
  
  async getPreferences(id) {
    const response = await apiClient.get(`/api/users/${id}/preferences`);
    return response.data.preferences;
  }
};

export default usersService; 
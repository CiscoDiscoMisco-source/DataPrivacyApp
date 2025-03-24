import apiClient from './api';

export const dataTypesService = {
  async getAll() {
    const response = await apiClient.get('/api/data-types');
    return response.data.data_types;
  },

  async getById(id) {
    const response = await apiClient.get(`/api/data-types/${id}`);
    return response.data.data_type;
  },

  async create(dataTypeData) {
    const response = await apiClient.post('/api/data-types', dataTypeData);
    return response.data.data_type;
  },

  async update(id, dataTypeData) {
    const response = await apiClient.put(`/api/data-types/${id}`, dataTypeData);
    return response.data.data_type;
  },

  async delete(id) {
    const response = await apiClient.delete(`/api/data-types/${id}`);
    return response.data;
  },
  
  async getUsageByCompany(dataTypeId, companyId) {
    const response = await apiClient.get(`/api/data-types/${dataTypeId}/usage/${companyId}`);
    return response.data.usage;
  },

  async search(query) {
    const response = await apiClient.get(`/api/search/data-types?q=${encodeURIComponent(query)}`);
    return response.data.results;
  }
};

export default dataTypesService; 
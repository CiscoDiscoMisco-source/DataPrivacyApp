import apiClient from './api';

export const dataSharingTermsService = {
  async getAll() {
    const response = await apiClient.get('/api/data-sharing-terms');
    return response.data.terms;
  },

  async getById(id) {
    const response = await apiClient.get(`/api/data-sharing-terms/${id}`);
    return response.data.term;
  },

  async create(termData) {
    const response = await apiClient.post('/api/data-sharing-terms', termData);
    return response.data.term;
  },

  async update(id, termData) {
    const response = await apiClient.put(`/api/data-sharing-terms/${id}`, termData);
    return response.data.term;
  },

  async delete(id) {
    const response = await apiClient.delete(`/api/data-sharing-terms/${id}`);
    return response.data;
  },

  async getByCompany(companyId) {
    const response = await apiClient.get(`/api/data-sharing-terms/company/${companyId}`);
    return response.data.terms;
  },

  async getByDataType(dataTypeId) {
    const response = await apiClient.get(`/api/data-sharing-terms/data-type/${dataTypeId}`);
    return response.data.terms;
  },

  async search(query) {
    const response = await apiClient.get(`/api/search/data-sharing-terms?q=${encodeURIComponent(query)}`);
    return response.data.results;
  }
};

export default dataSharingTermsService; 
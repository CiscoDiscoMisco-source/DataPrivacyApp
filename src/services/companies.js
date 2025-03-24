import apiClient from './api';

export const companiesService = {
  async getAll() {
    const response = await apiClient.get('/api/companies');
    return response.data.companies;
  },

  async getById(id) {
    const response = await apiClient.get(`/api/companies/${id}`);
    return response.data.company;
  },

  async create(companyData) {
    const response = await apiClient.post('/api/companies', companyData);
    return response.data.company;
  },

  async update(id, companyData) {
    const response = await apiClient.put(`/api/companies/${id}`, companyData);
    return response.data.company;
  },

  async delete(id) {
    const response = await apiClient.delete(`/api/companies/${id}`);
    return response.data;
  },

  async getSharingPolicies(id) {
    const response = await apiClient.get(`/api/companies/${id}/sharing-policies`);
    return response.data.policies;
  },

  async getRelatedCompanies(id) {
    const response = await apiClient.get(`/api/companies/${id}/related-companies`);
    return response.data.related_companies;
  },
  
  async search(query) {
    const response = await apiClient.get(`/api/search/companies?q=${encodeURIComponent(query)}`);
    return response.data.results;
  }
};

export default companiesService; 
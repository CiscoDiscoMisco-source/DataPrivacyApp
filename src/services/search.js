import apiClient from './api';

export const searchService = {
  async globalSearch(query, options = {}) {
    const params = new URLSearchParams();
    params.append('q', query);
    
    // Add optional filters
    if (options.types) {
      options.types.forEach(type => params.append('types', type));
    }
    
    if (options.limit) {
      params.append('limit', options.limit.toString());
    }
    
    if (options.page) {
      params.append('page', options.page.toString());
    }
    
    const response = await apiClient.get(`/api/search?${params.toString()}`);
    return response.data;
  },

  async searchCompanies(query, options = {}) {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (options.limit) {
      params.append('limit', options.limit.toString());
    }
    
    if (options.page) {
      params.append('page', options.page.toString());
    }
    
    const response = await apiClient.get(`/api/search/companies?${params.toString()}`);
    return response.data.results;
  },

  async searchDataTypes(query, options = {}) {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (options.limit) {
      params.append('limit', options.limit.toString());
    }
    
    if (options.page) {
      params.append('page', options.page.toString());
    }
    
    const response = await apiClient.get(`/api/search/data-types?${params.toString()}`);
    return response.data.results;
  },

  async searchDataSharingTerms(query, options = {}) {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (options.limit) {
      params.append('limit', options.limit.toString());
    }
    
    if (options.page) {
      params.append('page', options.page.toString());
    }
    
    const response = await apiClient.get(`/api/search/data-sharing-terms?${params.toString()}`);
    return response.data.results;
  }
};

export default searchService; 
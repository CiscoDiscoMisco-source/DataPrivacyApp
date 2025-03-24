import apiClient from './api';

export const userPreferencesService = {
  async getUserPreferences() {
    const response = await apiClient.get('/api/user-preferences');
    return response.data.preferences;
  },

  async updatePreferences(preferencesData) {
    const response = await apiClient.put('/api/user-preferences', preferencesData);
    return response.data.preferences;
  },

  async getCompanyPreferences(companyId) {
    const response = await apiClient.get(`/api/user-preferences/companies/${companyId}`);
    return response.data.preferences;
  },

  async updateCompanyPreferences(companyId, preferencesData) {
    const response = await apiClient.put(`/api/user-preferences/companies/${companyId}`, preferencesData);
    return response.data.preferences;
  },

  async getDataTypePreferences(dataTypeId) {
    const response = await apiClient.get(`/api/user-preferences/data-types/${dataTypeId}`);
    return response.data.preferences;
  },

  async updateDataTypePreferences(dataTypeId, preferencesData) {
    const response = await apiClient.put(`/api/user-preferences/data-types/${dataTypeId}`, preferencesData);
    return response.data.preferences;
  }
};

export default userPreferencesService; 
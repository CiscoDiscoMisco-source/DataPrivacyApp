// Data Service for handling API requests related to data management
import api from './api';

// Fetch all companies
export const getCompanies = async () => {
  try {
    const response = await api.get('/companies');
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

// Fetch a specific company by ID
export const getCompanyById = async (id) => {
  try {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching company ${id}:`, error);
    throw error;
  }
};

// Fetch user preferences for a specific company
export const getCompanyPreferences = async (companyId) => {
  try {
    const response = await api.get(`/companies/${companyId}/preferences`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching preferences for company ${companyId}:`, error);
    throw error;
  }
};

// Update user preferences for a specific company
export const updateCompanyPreferences = async (companyId, preferences) => {
  try {
    const response = await api.put(`/companies/${companyId}/preferences`, preferences);
    return response.data;
  } catch (error) {
    console.error(`Error updating preferences for company ${companyId}:`, error);
    throw error;
  }
};

// Fetch global user preferences
export const getGlobalPreferences = async () => {
  try {
    const response = await api.get('/preferences/global');
    return response.data;
  } catch (error) {
    console.error('Error fetching global preferences:', error);
    throw error;
  }
};

// Update global user preferences
export const updateGlobalPreferences = async (preferences) => {
  try {
    const response = await api.put('/preferences/global', preferences);
    return response.data;
  } catch (error) {
    console.error('Error updating global preferences:', error);
    throw error;
  }
};

// Fetch user tokens
export const getTokens = async () => {
  try {
    const response = await api.get('/tokens');
    return response.data;
  } catch (error) {
    console.error('Error fetching tokens:', error);
    throw error;
  }
};

// Create a new token
export const createToken = async (tokenData) => {
  try {
    const response = await api.post('/tokens', tokenData);
    return response.data;
  } catch (error) {
    console.error('Error creating token:', error);
    throw error;
  }
};

// Delete a token
export const deleteToken = async (tokenId) => {
  try {
    await api.delete(`/tokens/${tokenId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting token ${tokenId}:`, error);
    throw error;
  }
}; 
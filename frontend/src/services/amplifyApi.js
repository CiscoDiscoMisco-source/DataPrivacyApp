import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { DataCategory, SharingStatus, NotificationFrequency } from '../../amplify/data/resource';

/**
 * Generate a client for Amplify's Data API
 * This is a wrapper around Amplify's generated client to provide
 * a similar interface to our custom API service
 */
const client = generateClient();

// Utility to parse JSON stored as strings
const parseJsonField = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (e) {
    console.error('Error parsing JSON field:', e);
    return null;
  }
};

// Utility to stringify JSON for storage
const stringifyJsonField = (value) => {
  if (!value) return null;
  try {
    return JSON.stringify(value);
  } catch (e) {
    console.error('Error stringifying JSON field:', e);
    return null;
  }
};

// API Helper functions
const amplifyApiService = {
  // User-related operations
  getCurrentUser: async () => {
    try {
      const user = await getCurrentUser();
      const { data } = await client.models.User.get({ id: user.userId });
      return { data };
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },
  
  // Companies endpoints
  getUserCompanies: async () => {
    try {
      const user = await getCurrentUser();
      const { data: companies } = await client.models.Company.list({
        filter: { userId: { eq: user.userId } }
      });
      
      // Format to match the expected structure
      return { 
        data: companies.map(company => ({
          ...company,
          owner: { id: company.userId }
        }))
      };
    } catch (error) {
      console.error('Error getting user companies:', error);
      throw error;
    }
  },
  
  getCompany: async (companyId) => {
    try {
      const { data } = await client.models.Company.get({ id: companyId });
      
      // Get data types for this company
      const { data: dataTypes } = await client.models.DataType.list({
        filter: { companyId: { eq: companyId } }
      });
      
      // Get data sharing terms for this company
      const { data: dataSharingTerms } = await client.models.DataSharingTerm.list({
        filter: { companyId: { eq: companyId } }
      });
      
      // Format terms to include parsed JSON fields
      const formattedTerms = dataSharingTerms.map(term => ({
        ...term,
        conditions: parseJsonField(term.conditions)
      }));
      
      // Format data types to include parsed JSON fields
      const formattedDataTypes = dataTypes.map(dataType => ({
        ...dataType,
        validationRules: parseJsonField(dataType.validationRules)
      }));
      
      // Build the response to match the expected structure
      return { 
        data: {
          ...data,
          dataTypes: formattedDataTypes,
          dataSharingTerms: formattedTerms
        }
      };
    } catch (error) {
      console.error('Error getting company:', error);
      throw error;
    }
  },
  
  createCompany: async (companyData) => {
    try {
      const user = await getCurrentUser();
      const timestamp = new Date().toISOString();
      
      const newCompany = {
        ...companyData,
        userId: user.userId,
        createdAt: timestamp,
        updatedAt: timestamp,
        isActive: true
      };
      
      const { data } = await client.models.Company.create(newCompany);
      return { data };
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  },
  
  addDataSharingTerm: async (companyId, termData) => {
    try {
      const user = await getCurrentUser();
      const timestamp = new Date().toISOString();
      
      // Convert JSON object to string for storage
      const conditionsStr = stringifyJsonField(termData.conditions);
      
      const newTerm = {
        companyId,
        dataTypeId: termData.dataTypeId,
        sharedById: user.userId,
        sharedWithId: termData.sharedWithId,
        purpose: termData.purpose,
        duration: termData.duration,
        conditions: conditionsStr,
        status: termData.status || SharingStatus.PENDING,
        startDate: termData.startDate,
        endDate: termData.endDate,
        isActive: true,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      const { data } = await client.models.DataSharingTerm.create(newTerm);
      
      // Format the response to match expected structure
      return { 
        data: {
          ...data,
          conditions: parseJsonField(data.conditions)
        }
      };
    } catch (error) {
      console.error('Error adding data sharing term:', error);
      throw error;
    }
  },
  
  // Preferences endpoints
  getPreferences: async (params) => {
    try {
      const user = await getCurrentUser();
      const { data } = await client.models.UserPreferences.get({ userId: user.userId });
      
      // Parse JSON fields
      const formattedData = {
        ...data,
        notificationTypes: parseJsonField(data.notificationTypes),
        dataSharingPreferences: parseJsonField(data.dataSharingPreferences)
      };
      
      return { data: formattedData };
    } catch (error) {
      console.error('Error getting preferences:', error);
      throw error;
    }
  },
  
  setPreference: async (preferenceData) => {
    try {
      const user = await getCurrentUser();
      const timestamp = new Date().toISOString();
      
      // Convert JSON objects to strings for storage
      const notificationTypesStr = stringifyJsonField(preferenceData.notificationTypes);
      const dataSharingPreferencesStr = stringifyJsonField(preferenceData.dataSharingPreferences);
      
      // Check if preferences already exist
      let existingPrefs;
      try {
        existingPrefs = await client.models.UserPreferences.get({ userId: user.userId });
      } catch (e) {
        // No existing preferences
      }
      
      if (existingPrefs?.data) {
        // Update existing preferences
        const updatedPrefs = {
          id: existingPrefs.data.id,
          ...preferenceData,
          notificationTypes: notificationTypesStr,
          dataSharingPreferences: dataSharingPreferencesStr,
          updatedAt: timestamp
        };
        
        const { data } = await client.models.UserPreferences.update(updatedPrefs);
        
        // Format the response with parsed JSON fields
        return { 
          data: {
            ...data,
            notificationTypes: parseJsonField(data.notificationTypes),
            dataSharingPreferences: parseJsonField(data.dataSharingPreferences)
          }
        };
      } else {
        // Create new preferences
        const newPrefs = {
          userId: user.userId,
          ...preferenceData,
          notificationTypes: notificationTypesStr,
          dataSharingPreferences: dataSharingPreferencesStr,
          createdAt: timestamp,
          updatedAt: timestamp
        };
        
        const { data } = await client.models.UserPreferences.create(newPrefs);
        
        // Format the response with parsed JSON fields
        return { 
          data: {
            ...data,
            notificationTypes: parseJsonField(data.notificationTypes),
            dataSharingPreferences: parseJsonField(data.dataSharingPreferences)
          }
        };
      }
    } catch (error) {
      console.error('Error setting preferences:', error);
      throw error;
    }
  },
  
  updatePreference: async (preferenceId, data) => {
    return amplifyApiService.setPreference(data);
  },
  
  // Search endpoints
  searchCompanies: async (query, limit = 10) => {
    try {
      // Note: This is a simple search implementation
      // In a real app, you might want to use a more sophisticated search service
      const { data: companies } = await client.models.Company.list({
        filter: {
          or: [
            { name: { contains: query } },
            { description: { contains: query } }
          ]
        },
        limit
      });
      
      return { data: companies };
    } catch (error) {
      console.error('Error searching companies:', error);
      throw error;
    }
  },
  
  // Constants
  DataCategory,
  SharingStatus,
  NotificationFrequency
};

export default amplifyApiService; 
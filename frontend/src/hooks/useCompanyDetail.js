import { useState, useEffect } from 'react';
import api from '../services/api';

export const useCompanyDetail = (companyId) => {
  const [company, setCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [terms, setTerms] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingPreference, setSavingPreference] = useState(false);
  
  // Fetch company details, terms and preferences
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        
        // Fetch company details
        const companyResponse = await api.getCompany(companyId);
        setCompany(companyResponse.data.data);
        
        // Fetch company's data sharing terms from user companies endpoint
        const companiesResponse = await api.getUserCompanies();
        const companies = companiesResponse.data.data || [];
        const companyData = companies.find(c => 
          c.company && c.company.company_id === parseInt(companyId)
        );
        
        setCompanies(companies);
        setTerms(companyData?.terms || []);
        
        // Fetch company-specific preferences
        const preferencesResponse = await api.getPreferences({ company_id: companyId });
        setPreferences(preferencesResponse.data.data || []);
        
      } catch (err) {
        console.error('Error fetching company data:', err);
        setError('Failed to load company data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanyData();
  }, [companyId]);
  
  // Handle preference toggle
  const handlePreferenceToggle = async (dataType) => {
    try {
      setSavingPreference(true);
      
      // Find existing preference
      const existingPref = preferences.find(p => p.data_type === dataType);
      
      if (existingPref) {
        // Update existing preference
        const newValue = !existingPref.allowed;
        await api.updatePreference(existingPref.preference_id, { allowed: newValue });
        
        // Update local state
        setPreferences(preferences.map(p => 
          p.preference_id === existingPref.preference_id
            ? { ...p, allowed: newValue }
            : p
        ));
      } else {
        // Create new preference
        const response = await api.setPreference({
          company_id: parseInt(companyId),
          data_type: dataType,
          allowed: true
        });
        
        // Add to local state
        setPreferences([...preferences, response.data.data]);
      }
    } catch (err) {
      console.error('Error updating preference:', err);
      setError('Failed to update preference. Please try again.');
    } finally {
      setSavingPreference(false);
    }
  };
  
  // Clone preferences from another company
  const handleClonePreferences = async (sourceCompanyId) => {
    try {
      setSavingPreference(true);
      
      // Clone preferences
      const response = await api.clonePreferences(sourceCompanyId, companyId);
      
      // Refresh preferences after cloning
      const preferencesResponse = await api.getPreferences({ company_id: companyId });
      setPreferences(preferencesResponse.data.data || []);
      
      return response;
    } catch (err) {
      console.error('Error cloning preferences:', err);
      setError('Failed to clone preferences. Please try again.');
      return null;
    } finally {
      setSavingPreference(false);
    }
  };
  
  // Get preference for a data type
  const getPreference = (dataType) => {
    return preferences.find(p => p.data_type === dataType);
  };

  return {
    company,
    companies,
    terms,
    preferences,
    loading,
    error,
    savingPreference,
    handlePreferenceToggle,
    handleClonePreferences,
    getPreference
  };
}; 
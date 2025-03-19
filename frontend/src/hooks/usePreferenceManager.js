import { useState, useEffect } from 'react';
import api from '../services/api';

// Common data types for preferences that can be reused
export const commonDataTypes = [
  'Email', 
  'Location', 
  'Browsing History', 
  'Purchase History', 
  'Marketing', 
  'Third Party Sharing'
];

export const usePreferenceManager = () => {
  const [globalPreferences, setGlobalPreferences] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyPreferences, setCompanyPreferences] = useState([]);
  const [newDataType, setNewDataType] = useState('');
  const [cloneSource, setCloneSource] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch global preferences
        const globalPrefsResponse = await api.getPreferences({ global: true });
        setGlobalPreferences(globalPrefsResponse.data.data || []);
        
        // Fetch user's companies
        const companiesResponse = await api.getUserCompanies();
        setCompanies(companiesResponse.data.data || []);
        
      } catch (err) {
        console.error('Error fetching preferences data:', err);
        setError('Failed to load preferences. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Fetch company-specific preferences when a company is selected
  useEffect(() => {
    const fetchCompanyPreferences = async () => {
      if (!selectedCompany) {
        setCompanyPreferences([]);
        return;
      }
      
      try {
        const response = await api.getPreferences({ company_id: selectedCompany });
        setCompanyPreferences(response.data.data || []);
      } catch (err) {
        console.error('Error fetching company preferences:', err);
        setError('Failed to load company preferences.');
      }
    };
    
    fetchCompanyPreferences();
  }, [selectedCompany]);
  
  // Handle preference toggle
  const handlePreferenceToggle = async (preference, isGlobal = false) => {
    try {
      setSaving(true);
      setMessage('');
      
      // Update the preference
      await api.updatePreference(preference.preference_id, { allowed: !preference.allowed });
      
      // Update local state
      if (isGlobal) {
        setGlobalPreferences(globalPreferences.map(p => 
          p.preference_id === preference.preference_id
            ? { ...p, allowed: !preference.allowed }
            : p
        ));
      } else {
        setCompanyPreferences(companyPreferences.map(p => 
          p.preference_id === preference.preference_id
            ? { ...p, allowed: !preference.allowed }
            : p
        ));
      }
      
      setMessage(`Preference for ${preference.data_type} updated successfully.`);
    } catch (err) {
      console.error('Error updating preference:', err);
      setError('Failed to update preference. Please try again.');
    } finally {
      setSaving(false);
      
      // Clear message after a delay
      setTimeout(() => setMessage(''), 3000);
    }
  };
  
  // Add new preference
  const handleAddPreference = async (dataType, isGlobal = false) => {
    if (!dataType || !dataType.trim()) {
      setError('Please enter a data type.');
      return;
    }
    
    try {
      setSaving(true);
      setMessage('');
      
      const preferenceData = {
        data_type: dataType,
        allowed: false
      };
      
      if (!isGlobal) {
        if (!selectedCompany) {
          setError('Please select a company first.');
          setSaving(false);
          return;
        }
        preferenceData.company_id = parseInt(selectedCompany);
      }
      
      const response = await api.setPreference(preferenceData);
      const newPreference = response.data.data;
      
      // Update local state
      if (isGlobal) {
        setGlobalPreferences([...globalPreferences, newPreference]);
      } else {
        setCompanyPreferences([...companyPreferences, newPreference]);
      }
      
      // Clear input
      setNewDataType('');
      setMessage(`New preference for ${newPreference.data_type} added successfully.`);
    } catch (err) {
      console.error('Error adding preference:', err);
      setError('Failed to add preference. Please try again.');
    } finally {
      setSaving(false);
      
      // Clear message after a delay
      setTimeout(() => setMessage(''), 3000);
    }
  };
  
  // Select a company
  const handleCompanySelect = (companyId) => {
    setSelectedCompany(companyId ? parseInt(companyId) : null);
    setCloneSource('');
  };
  
  // Clone preferences from one company to another
  const handleClonePreferences = async (sourceId) => {
    if (!sourceId || !selectedCompany) {
      setError('Please select both source and target companies.');
      return;
    }
    
    if (sourceId === selectedCompany) {
      setError('Source and target companies cannot be the same.');
      return;
    }
    
    try {
      setSaving(true);
      setMessage('');
      
      const response = await api.clonePreferences(sourceId, selectedCompany);
      
      // Refresh company preferences
      const prefsResponse = await api.getPreferences({ company_id: selectedCompany });
      setCompanyPreferences(prefsResponse.data.data || []);
      
      setMessage(response.data.message || 'Preferences cloned successfully.');
    } catch (err) {
      console.error('Error cloning preferences:', err);
      setError('Failed to clone preferences. Please try again.');
    } finally {
      setSaving(false);
      
      // Clear message after a delay
      setTimeout(() => setMessage(''), 3000);
    }
  };
  
  // Get company name by ID
  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.company.company_id === parseInt(companyId));
    return company ? company.company.name : 'Unknown Company';
  };

  return {
    globalPreferences,
    companies,
    selectedCompany,
    companyPreferences,
    newDataType,
    setNewDataType,
    cloneSource,
    setCloneSource,
    loading,
    error,
    setError,
    message,
    setMessage,
    saving,
    handlePreferenceToggle,
    handleAddPreference,
    handleCompanySelect,
    handleClonePreferences,
    getCompanyName
  };
}; 
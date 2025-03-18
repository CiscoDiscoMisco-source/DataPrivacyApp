import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const PreferenceManager = () => {
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
  
  // Common data types for preferences
  const dataTypes = ['Email', 'Location', 'Browsing History', 'Purchase History', 'Marketing', 'Third Party Sharing'];
  
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
  const handleAddPreference = async (isGlobal = false) => {
    if (!newDataType.trim()) {
      setError('Please enter a data type.');
      return;
    }
    
    try {
      setSaving(true);
      setMessage('');
      
      const preferenceData = {
        data_type: newDataType,
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
      const newPreference = response.data.data.preference;
      
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
  
  // Clone preferences from one company to another
  const handleClonePreferences = async () => {
    if (!cloneSource || !selectedCompany) {
      setError('Please select both source and target companies.');
      return;
    }
    
    if (cloneSource === selectedCompany) {
      setError('Source and target companies cannot be the same.');
      return;
    }
    
    try {
      setSaving(true);
      setMessage('');
      
      const response = await api.clonePreferences(cloneSource, selectedCompany);
      
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
  
  if (loading) {
    return <div className="loading">Loading preferences...</div>;
  }
  
  return (
    <div className="preference-manager">
      <h1>Manage Privacy Preferences</h1>
      
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      
      <div className="preference-sections">
        {/* Global Preferences Section */}
        <div className="preference-section global-preferences">
          <h2>Global Preferences</h2>
          <p>These preferences apply to all companies unless overridden by company-specific preferences.</p>
          
          <div className="add-preference">
            <select
              value={newDataType}
              onChange={(e) => setNewDataType(e.target.value)}
              disabled={saving}
            >
              <option value="">Select data type...</option>
              {dataTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Or enter custom data type"
              value={newDataType === '' || dataTypes.includes(newDataType) ? '' : newDataType}
              onChange={(e) => setNewDataType(e.target.value)}
              disabled={saving}
            />
            <button 
              className="btn-primary" 
              onClick={() => handleAddPreference(true)}
              disabled={saving || !newDataType.trim()}
            >
              Add Global Preference
            </button>
          </div>
          
          {globalPreferences.length === 0 ? (
            <p>No global preferences set.</p>
          ) : (
            <div className="preferences-list">
              {globalPreferences.map(pref => (
                <div key={pref.preference_id} className="preference-item">
                  <span className="data-type">{pref.data_type}</span>
                  <span className={`status ${pref.allowed ? 'allowed' : 'denied'}`}>
                    {pref.allowed ? 'Allowed' : 'Denied'}
                  </span>
                  <button
                    className={`toggle-btn ${pref.allowed ? 'allowed' : 'denied'}`}
                    onClick={() => handlePreferenceToggle(pref, true)}
                    disabled={saving}
                  >
                    {pref.allowed ? 'Deny' : 'Allow'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Company-specific Preferences Section */}
        <div className="preference-section company-preferences">
          <h2>Company-specific Preferences</h2>
          
          <div className="company-selector">
            <label>Select Company:</label>
            <select
              value={selectedCompany || ''}
              onChange={(e) => setSelectedCompany(e.target.value ? parseInt(e.target.value) : null)}
              disabled={saving}
            >
              <option value="">Select a company...</option>
              {companies.map(company => (
                <option key={company.company.company_id} value={company.company.company_id}>
                  {company.company.name}
                </option>
              ))}
            </select>
          </div>
          
          {selectedCompany && (
            <>
              <div className="company-actions">
                <div className="add-preference">
                  <select
                    value={newDataType}
                    onChange={(e) => setNewDataType(e.target.value)}
                    disabled={saving}
                  >
                    <option value="">Select data type...</option>
                    {dataTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Or enter custom data type"
                    value={newDataType === '' || dataTypes.includes(newDataType) ? '' : newDataType}
                    onChange={(e) => setNewDataType(e.target.value)}
                    disabled={saving}
                  />
                  <button 
                    className="btn-primary" 
                    onClick={() => handleAddPreference(false)}
                    disabled={saving || !newDataType.trim()}
                  >
                    Add Company Preference
                  </button>
                </div>
                
                <div className="clone-preferences">
                  <label>Clone preferences from:</label>
                  <select
                    value={cloneSource || ''}
                    onChange={(e) => setCloneSource(e.target.value)}
                    disabled={saving}
                  >
                    <option value="">Select source company...</option>
                    {companies.filter(c => c.company.company_id !== parseInt(selectedCompany))
                      .map(company => (
                        <option key={company.company.company_id} value={company.company.company_id}>
                          {company.company.name}
                        </option>
                      ))}
                  </select>
                  <button 
                    className="btn-secondary" 
                    onClick={handleClonePreferences}
                    disabled={saving || !cloneSource}
                  >
                    Clone Preferences
                  </button>
                </div>
              </div>
              
              <h3>Preferences for {getCompanyName(selectedCompany)}</h3>
              {companyPreferences.length === 0 ? (
                <p>No preferences set for this company.</p>
              ) : (
                <div className="preferences-list">
                  {companyPreferences.map(pref => (
                    <div key={pref.preference_id} className="preference-item">
                      <span className="data-type">{pref.data_type}</span>
                      <span className={`status ${pref.allowed ? 'allowed' : 'denied'}`}>
                        {pref.allowed ? 'Allowed' : 'Denied'}
                      </span>
                      <button
                        className={`toggle-btn ${pref.allowed ? 'allowed' : 'denied'}`}
                        onClick={() => handlePreferenceToggle(pref, false)}
                        disabled={saving}
                      >
                        {pref.allowed ? 'Deny' : 'Allow'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="company-link">
                <Link to={`/companies/${selectedCompany}`}>
                  View {getCompanyName(selectedCompany)} Details
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreferenceManager; 
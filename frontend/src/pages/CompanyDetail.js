import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import CompanyNetwork from '../components/CompanyNetwork';

const CompanyDetail = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  
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
        setCompany(companyResponse.data.data.company);
        
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
        setPreferences([...preferences, response.data.data.preference]);
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
      const response = await api.clonePreferences(sourceCompanyId, companyId);
      
      // Update preferences after cloning
      const preferencesResponse = await api.getPreferences({ company_id: companyId });
      setPreferences(preferencesResponse.data.data || []);
      
      return response;
    } catch (err) {
      console.error('Error cloning preferences:', err);
      setError('Failed to clone preferences. Please try again.');
    }
  };
  
  // Get preference for a data type
  const getPreference = (dataType) => {
    return preferences.find(p => p.data_type === dataType);
  };
  
  if (loading) {
    return <div className="loading">Loading company details...</div>;
  }
  
  if (!company) {
    return <div className="error-message">Company not found</div>;
  }
  
  return (
    <div className="company-detail">
      <button 
        className="back-button" 
        onClick={() => navigate('/companies')}
      >
        &larr; Back to Companies
      </button>
      
      <h1>{company.name}</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="company-info">
        <p>{company.description || 'No description available'}</p>
        <p><strong>Domain:</strong> {company.domain}</p>
      </div>
      
      <div className="data-sharing-terms">
        <h2>Data Sharing Terms</h2>
        {terms.length === 0 ? (
          <p>No data sharing terms available for this company.</p>
        ) : (
          <div className="terms-list">
            {terms.map(term => (
              <div key={term.term_id} className="term-card">
                <h3>{term.data_type}</h3>
                <p>{term.terms}</p>
                <div className="preference-toggle">
                  <span>Allow {term.data_type} sharing</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={getPreference(term.data_type)?.allowed || false}
                      onChange={() => handlePreferenceToggle(term.data_type)}
                      disabled={savingPreference}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="preferences-section">
        <h2>Data Preferences</h2>
        {preferences.length === 0 ? (
          <p>No preferences set for this company.</p>
        ) : (
          <div className="preferences-list">
            {preferences.map(pref => (
              <div key={pref.preference_id} className="preference-item">
                <span>{pref.data_type}</span>
                <span>{pref.allowed ? 'Allowed' : 'Denied'}</span>
                <button
                  className={`toggle-btn ${pref.allowed ? 'allowed' : 'denied'}`}
                  onClick={() => handlePreferenceToggle(pref.data_type)}
                  disabled={savingPreference}
                >
                  {pref.allowed ? 'Deny' : 'Allow'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="company-visualization">
        <h2>Data Sharing Visualization</h2>
        <div className="company-map">
          {companies.length > 0 ? (
            <CompanyNetwork 
              companies={companies} 
              selectedCompany={companyId}
              preferences={preferences}
            />
          ) : (
            <p className="placeholder-text">No company data available for visualization.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail; 
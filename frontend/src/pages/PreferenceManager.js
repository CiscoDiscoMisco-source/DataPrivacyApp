import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import GlobalPreferences from '../components/preferences/GlobalPreferences';
import CompanyPreferenceList from '../components/preferences/CompanyPreferenceList';
import PreferenceForm from '../components/preferences/PreferenceForm';
import ClonePreferencesForm from '../components/preferences/ClonePreferencesForm';
import { usePreferenceManager } from '../hooks/usePreferenceManager';

const PreferenceManager = () => {
  const {
    globalPreferences,
    companies,
    selectedCompany,
    companyPreferences,
    loading,
    error,
    message,
    saving,
    handlePreferenceToggle,
    handleAddPreference,
    handleCompanySelect,
    handleClonePreferences,
    getCompanyName
  } = usePreferenceManager();

  if (loading) {
    return <div className="alert alert-info">Loading preferences...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container my-4">
      <h1>Privacy Preference Manager</h1>
      
      {message && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {message}
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setMessage('')}></button>
        </div>
      )}
      
      <div className="row mt-4">
        <div className="col-12 col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h3>Global Preferences</h3>
              <p className="text-muted">These settings apply to all companies unless overridden</p>
            </div>
            <div className="card-body">
              <GlobalPreferences 
                preferences={globalPreferences} 
                onToggle={(pref) => handlePreferenceToggle(pref, true)}
                saving={saving}
              />
              
              <PreferenceForm 
                onAddPreference={(dataType) => handleAddPreference(dataType, true)}
                saving={saving}
              />
            </div>
          </div>
        </div>
        
        <div className="col-12 col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>Company-Specific Preferences</h3>
              <select 
                className="form-select mt-2" 
                value={selectedCompany || ''} 
                onChange={(e) => handleCompanySelect(e.target.value)}
              >
                <option value="">Select a company</option>
                {companies.map(companyData => (
                  <option key={companyData.company.company_id} value={companyData.company.company_id}>
                    {companyData.company.name}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedCompany && (
              <div className="card-body">
                <CompanyPreferenceList
                  preferences={companyPreferences}
                  onToggle={handlePreferenceToggle}
                  saving={saving}
                />
                
                <PreferenceForm 
                  onAddPreference={handleAddPreference}
                  saving={saving}
                />
                
                <hr />
                
                <ClonePreferencesForm
                  companies={companies}
                  selectedCompany={selectedCompany}
                  onClone={handleClonePreferences}
                  getCompanyName={getCompanyName}
                  saving={saving}
                />
              </div>
            )}
            
            {!selectedCompany && (
              <div className="card-body text-center">
                <p>Select a company to manage its preferences</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default PreferenceManager; 
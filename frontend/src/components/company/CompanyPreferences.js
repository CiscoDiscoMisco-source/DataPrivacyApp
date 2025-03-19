import React, { useState } from 'react';
import { commonDataTypes } from '../../hooks/usePreferenceManager';

const CompanyPreferences = ({ 
  preferences, 
  companies, 
  currentCompanyId, 
  onTogglePreference, 
  onClonePreferences 
}) => {
  const [sourceCompany, setSourceCompany] = useState('');
  const [newDataType, setNewDataType] = useState('');
  const [customType, setCustomType] = useState('');
  const [isCloning, setIsCloning] = useState(false);
  
  const handleAddPreference = () => {
    // Use custom type if entered, otherwise use selected type
    const dataType = customType || newDataType;
    
    if (dataType) {
      onTogglePreference(dataType);
      
      // Reset form
      setNewDataType('');
      setCustomType('');
    }
  };
  
  const handleClone = async () => {
    if (!sourceCompany) return;
    
    setIsCloning(true);
    try {
      await onClonePreferences(sourceCompany);
      setSourceCompany('');
    } finally {
      setIsCloning(false);
    }
  };
  
  // Filter companies to exclude current one
  const availableCompanies = companies.filter(
    c => c.company && c.company.company_id !== parseInt(currentCompanyId)
  );
  
  // Check if preference exists
  const hasPreference = (dataType) => {
    return preferences.some(p => p.data_type === dataType);
  };
  
  // Get preference for a data type
  const getPreference = (dataType) => {
    return preferences.find(p => p.data_type === dataType);
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3>Data Preferences</h3>
      </div>
      <div className="card-body">
        {/* Current Preferences List */}
        {preferences.length === 0 ? (
          <p className="text-muted mb-4">No preferences set for this company yet.</p>
        ) : (
          <div className="mb-4">
            <h5>Current Preferences</h5>
            {preferences.map(pref => (
              <div 
                key={pref.preference_id} 
                className="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom"
              >
                <div>
                  <span className="fw-bold">{pref.data_type}</span>
                  <span className={`ms-2 badge ${pref.allowed ? 'bg-success' : 'bg-danger'}`}>
                    {pref.allowed ? 'Allowed' : 'Denied'}
                  </span>
                </div>
                <button
                  className={`btn btn-sm ${pref.allowed ? 'btn-outline-danger' : 'btn-outline-success'}`}
                  onClick={() => onTogglePreference(pref.data_type)}
                >
                  {pref.allowed ? 'Deny' : 'Allow'}
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Add New Preference Form */}
        <div className="mb-4">
          <h5>Add New Preference</h5>
          <div className="mb-3">
            <label htmlFor="dataType" className="form-label">Select Data Type</label>
            <select
              id="dataType"
              className="form-select"
              value={newDataType}
              onChange={(e) => {
                setNewDataType(e.target.value);
                if (e.target.value) setCustomType('');
              }}
            >
              <option value="">Select data type...</option>
              {commonDataTypes
                .filter(type => !hasPreference(type))
                .map(type => (
                  <option key={type} value={type}>{type}</option>
                ))
              }
            </select>
          </div>
          
          <div className="mb-3">
            <label htmlFor="customType" className="form-label">Or Enter Custom Data Type</label>
            <input
              type="text"
              id="customType"
              className="form-control"
              placeholder="Enter custom data type"
              value={customType}
              onChange={(e) => {
                setCustomType(e.target.value);
                if (e.target.value) setNewDataType('');
              }}
            />
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={handleAddPreference}
            disabled={!newDataType && !customType}
          >
            Add Preference
          </button>
        </div>
        
        {/* Clone Preferences Section */}
        {availableCompanies.length > 0 && (
          <div>
            <hr />
            <h5>Clone Preferences From Another Company</h5>
            <div className="row">
              <div className="col-md-8">
                <select
                  className="form-select mb-3"
                  value={sourceCompany}
                  onChange={(e) => setSourceCompany(e.target.value)}
                >
                  <option value="">Select a company...</option>
                  {availableCompanies.map(company => (
                    <option 
                      key={company.company.company_id} 
                      value={company.company.company_id}
                    >
                      {company.company.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <button 
                  className="btn btn-secondary w-100"
                  onClick={handleClone}
                  disabled={!sourceCompany || isCloning}
                >
                  {isCloning ? 'Cloning...' : 'Clone'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyPreferences; 
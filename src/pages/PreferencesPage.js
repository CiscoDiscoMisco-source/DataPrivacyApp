import React from 'react';

const PreferencesPage = () => {
  return (
    <div className="preferences-page">
      <h2>My Privacy Preferences</h2>
      
      <div className="form-container">
        <p className="mb-4">
          Manage your global privacy preferences across all companies. 
          These settings will be applied as defaults when a new company is added to the system.
        </p>
        
        <h3 className="mb-3">Data Usage Preferences</h3>
        
        <div className="mb-4">
          <div className="form-check mb-2">
            <input className="form-check-input" type="checkbox" id="marketingPref" />
            <label className="form-check-label" htmlFor="marketingPref">
              Allow marketing communications
            </label>
          </div>
          <div className="form-check mb-2">
            <input className="form-check-input" type="checkbox" id="analyticsPref" />
            <label className="form-check-label" htmlFor="analyticsPref">
              Allow analytics and usage data collection
            </label>
          </div>
          <div className="form-check mb-2">
            <input className="form-check-input" type="checkbox" id="thirdPartyPref" />
            <label className="form-check-label" htmlFor="thirdPartyPref">
              Allow sharing data with third parties
            </label>
          </div>
        </div>
        
        <h3 className="mb-3">Communication Preferences</h3>
        
        <div className="mb-4">
          <div className="form-check mb-2">
            <input className="form-check-input" type="checkbox" id="emailPref" />
            <label className="form-check-label" htmlFor="emailPref">
              Email notifications
            </label>
          </div>
          <div className="form-check mb-2">
            <input className="form-check-input" type="checkbox" id="smsPref" />
            <label className="form-check-label" htmlFor="smsPref">
              SMS notifications
            </label>
          </div>
        </div>
        
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button className="btn btn-primary" type="button">
            Save Preferences
          </button>
        </div>
      </div>
      
      <div className="mt-5">
        <h3>Company-Specific Preferences</h3>
        <p>You have set custom preferences for the following companies:</p>
        
        <div className="list-group">
          <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            Acme Corporation
            <span className="badge bg-primary rounded-pill">Custom</span>
          </a>
          <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            Tech Innovations Inc
            <span className="badge bg-primary rounded-pill">Custom</span>
          </a>
          <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            Global Data Systems
            <span className="badge bg-primary rounded-pill">Custom</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage; 
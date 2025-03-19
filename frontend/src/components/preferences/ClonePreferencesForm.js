import React, { useState } from 'react';

const ClonePreferencesForm = ({ companies, selectedCompany, onClone, getCompanyName, saving }) => {
  const [sourceCompany, setSourceCompany] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sourceCompany) {
      onClone(sourceCompany);
      setSourceCompany('');
    }
  };

  // Filter out the currently selected company
  const availableCompanies = companies.filter(
    company => company.company.company_id !== parseInt(selectedCompany)
  );

  if (availableCompanies.length === 0) {
    return (
      <div className="alert alert-info">
        You need at least one other company to clone preferences from.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h5>Clone Preferences</h5>
      <p className="text-muted">
        Copy all preference settings from another company to {getCompanyName(selectedCompany)}
      </p>
      
      <div className="row">
        <div className="col-md-8">
          <div className="mb-3">
            <label htmlFor="sourceCompany" className="form-label">Source Company</label>
            <select
              id="sourceCompany"
              className="form-select"
              value={sourceCompany}
              onChange={(e) => setSourceCompany(e.target.value)}
              disabled={saving}
            >
              <option value="">Select source company...</option>
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
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button
            type="submit"
            className="btn btn-secondary mb-3 w-100"
            disabled={saving || !sourceCompany}
          >
            {saving ? 'Cloning...' : 'Clone Preferences'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ClonePreferencesForm; 
import React from 'react';

const CompanyPreferenceList = ({ preferences, onToggle, saving }) => {
  if (preferences.length === 0) {
    return <p className="text-muted">No preferences set for this company yet.</p>;
  }

  return (
    <div className="preference-list mb-4">
      <h5>Current Preferences</h5>
      {preferences.map(preference => (
        <div key={preference.preference_id} className="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
          <div>
            <span className="fw-bold">{preference.data_type}</span>
            <span className={`ms-2 badge ${preference.allowed ? 'bg-success' : 'bg-danger'}`}>
              {preference.allowed ? 'Allowed' : 'Denied'}
            </span>
          </div>
          <button
            className={`btn btn-sm ${preference.allowed ? 'btn-outline-danger' : 'btn-outline-success'}`}
            onClick={() => onToggle(preference)}
            disabled={saving}
          >
            {preference.allowed ? 'Deny' : 'Allow'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default CompanyPreferenceList; 
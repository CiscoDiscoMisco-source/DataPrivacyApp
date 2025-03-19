import React, { useState } from 'react';
import { commonDataTypes } from '../../hooks/usePreferenceManager';

const PreferenceForm = ({ onAddPreference, saving }) => {
  const [dataType, setDataType] = useState('');
  const [customType, setCustomType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // If custom type is set, use that, otherwise use the selected data type
    const finalDataType = customType || dataType;
    
    if (finalDataType.trim()) {
      onAddPreference(finalDataType);
      // Reset form
      setDataType('');
      setCustomType('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h5>Add New Preference</h5>
      
      <div className="mb-3">
        <label htmlFor="dataType" className="form-label">Select Data Type</label>
        <select
          id="dataType"
          className="form-select"
          value={dataType}
          onChange={(e) => {
            setDataType(e.target.value);
            // Clear custom type when dropdown selection changes
            if (e.target.value) setCustomType('');
          }}
          disabled={saving}
        >
          <option value="">Select data type...</option>
          {commonDataTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
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
            // Clear dropdown selection when typing custom type
            if (e.target.value) setDataType('');
          }}
          disabled={saving}
        />
      </div>
      
      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={saving || (!dataType && !customType.trim())}
      >
        {saving ? 'Adding...' : 'Add Preference'}
      </button>
    </form>
  );
};

export default PreferenceForm; 
import React from 'react';
import DataUsageSection from '../components/preference/DataUsageSection';
import CommunicationSection from '../components/preference/CommunicationSection';
import CompanyPreferencesList from '../components/preference/CompanyPreferencesList';

const PreferencesPage = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Privacy Preferences</h2>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <p className="text-gray-600 mb-6">
          Manage your global privacy preferences across all companies. 
          These settings will be applied as defaults when a new company is added to the system.
        </p>
        
        <DataUsageSection />
        <CommunicationSection />
        
        <div className="flex justify-end mt-6">
          <button 
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
            type="button"
          >
            Save Preferences
          </button>
        </div>
      </div>
      
      <CompanyPreferencesList />
    </div>
  );
};

export default PreferencesPage; 
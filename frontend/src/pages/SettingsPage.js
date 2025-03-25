import React from 'react';
import AccountSection from '../components/settings/AccountSection';
import NotificationSection from '../components/settings/NotificationSection';
import SecuritySection from '../components/settings/SecuritySection';
import DangerZoneSection from '../components/settings/DangerZoneSection';

const SettingsPage = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h2>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <AccountSection />
        <NotificationSection />
        <SecuritySection />
        
        <div className="flex justify-end mt-6">
          <button 
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
            type="button"
          >
            Save Settings
          </button>
        </div>
      </div>
      
      <DangerZoneSection />
    </div>
  );
};

export default SettingsPage; 
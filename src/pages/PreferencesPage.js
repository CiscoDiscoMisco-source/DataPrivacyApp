import React from 'react';

const PreferencesPage = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Privacy Preferences</h2>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <p className="text-gray-600 mb-6">
          Manage your global privacy preferences across all companies. 
          These settings will be applied as defaults when a new company is added to the system.
        </p>
        
        <h3 className="text-xl font-medium text-gray-800 mb-4">Data Usage Preferences</h3>
        
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <input 
              className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded" 
              type="checkbox" 
              id="marketingPref" 
            />
            <label className="ml-3 block text-sm font-medium text-gray-700" htmlFor="marketingPref">
              Allow marketing communications
            </label>
          </div>
          <div className="flex items-center mb-3">
            <input 
              className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded" 
              type="checkbox" 
              id="analyticsPref" 
            />
            <label className="ml-3 block text-sm font-medium text-gray-700" htmlFor="analyticsPref">
              Allow analytics and usage data collection
            </label>
          </div>
          <div className="flex items-center mb-3">
            <input 
              className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded" 
              type="checkbox" 
              id="thirdPartyPref" 
            />
            <label className="ml-3 block text-sm font-medium text-gray-700" htmlFor="thirdPartyPref">
              Allow sharing data with third parties
            </label>
          </div>
        </div>
        
        <h3 className="text-xl font-medium text-gray-800 mb-4">Communication Preferences</h3>
        
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <input 
              className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded" 
              type="checkbox" 
              id="emailPref" 
            />
            <label className="ml-3 block text-sm font-medium text-gray-700" htmlFor="emailPref">
              Email notifications
            </label>
          </div>
          <div className="flex items-center mb-3">
            <input 
              className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded" 
              type="checkbox" 
              id="smsPref" 
            />
            <label className="ml-3 block text-sm font-medium text-gray-700" htmlFor="smsPref">
              SMS notifications
            </label>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button 
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
            type="button"
          >
            Save Preferences
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-medium text-gray-800 mb-3">Company-Specific Preferences</h3>
        <p className="text-gray-600 mb-4">You have set custom preferences for the following companies:</p>
        
        <div className="divide-y divide-gray-200">
          <div className="py-4 flex justify-between items-center">
            <span className="font-medium">Acme Corporation</span>
            <span className="px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">Custom</span>
          </div>
          <div className="py-4 flex justify-between items-center">
            <span className="font-medium">Tech Innovations Inc</span>
            <span className="px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">Custom</span>
          </div>
          <div className="py-4 flex justify-between items-center">
            <span className="font-medium">Global Data Systems</span>
            <span className="px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">Custom</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage; 
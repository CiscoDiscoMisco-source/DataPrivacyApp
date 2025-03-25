import React from 'react';

const DataUsageSection = () => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Data Usage Preferences</h3>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="marketingPref"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
          />
          <label htmlFor="marketingPref" className="ml-3 block text-sm font-medium text-gray-700">
            Allow marketing communications
          </label>
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="analyticsPref"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
          />
          <label htmlFor="analyticsPref" className="ml-3 block text-sm font-medium text-gray-700">
            Allow analytics and usage data collection
          </label>
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="thirdPartyPref"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
          />
          <label htmlFor="thirdPartyPref" className="ml-3 block text-sm font-medium text-gray-700">
            Allow sharing data with third parties
          </label>
        </div>
      </div>
    </div>
  );
};

export default DataUsageSection; 
import React from 'react';

const CommunicationSection = () => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Communication Preferences</h3>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="emailPref"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
          />
          <label htmlFor="emailPref" className="ml-3 block text-sm font-medium text-gray-700">
            Email notifications
          </label>
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="smsPref"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
          />
          <label htmlFor="smsPref" className="ml-3 block text-sm font-medium text-gray-700">
            SMS notifications
          </label>
        </div>
      </div>
    </div>
  );
};

export default CommunicationSection; 
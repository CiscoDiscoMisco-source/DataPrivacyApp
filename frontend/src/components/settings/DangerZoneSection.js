import React from 'react';

const DangerZoneSection = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
      <h3 className="text-xl font-medium text-red-600 mb-2">Danger Zone</h3>
      <p className="text-gray-600 mb-4">These actions cannot be undone. Please proceed with caution.</p>
      
      <div className="flex gap-4">
        <button 
          className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50" 
          type="button"
        >
          Delete Account
        </button>
        <button 
          className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50" 
          type="button"
        >
          Export All Data
        </button>
      </div>
    </div>
  );
};

export default DangerZoneSection; 
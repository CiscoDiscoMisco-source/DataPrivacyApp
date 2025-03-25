import React from 'react';

const SecuritySection = () => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Security</h3>
      <div className="mb-4">
        <button 
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
          type="button"
        >
          Change Password
        </button>
      </div>
      <div className="mb-6">
        <div className="flex items-center">
          <label className="toggle-switch">
            <input type="checkbox" id="twoFactor" />
            <span className="toggle-slider"></span>
          </label>
          <label className="ml-3 block text-sm font-medium text-gray-700" htmlFor="twoFactor">
            Two-Factor Authentication
          </label>
        </div>
        <p className="mt-1 text-sm text-gray-500">Add an extra layer of security to your account</p>
      </div>
    </div>
  );
};

export default SecuritySection; 
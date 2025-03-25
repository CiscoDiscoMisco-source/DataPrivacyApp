import React from 'react';

const SettingsPage = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h2>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-xl font-medium text-gray-800 mb-4">Account Information</h3>
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            id="fullName" 
            placeholder="Enter your full name" 
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            id="email" 
            placeholder="Enter your email" 
          />
        </div>
        <div className="mb-6">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input 
            type="tel" 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            id="phone" 
            placeholder="Enter your phone number" 
          />
        </div>
        
        <h3 className="text-xl font-medium text-gray-800 mb-4">Notification Settings</h3>
        <div className="mb-4">
          <div className="flex items-center">
            <label className="toggle-switch">
              <input type="checkbox" id="emailNotif" />
              <span className="toggle-slider"></span>
            </label>
            <label className="ml-3 block text-sm font-medium text-gray-700" htmlFor="emailNotif">
              Email Notifications
            </label>
          </div>
          <p className="mt-1 text-sm text-gray-500">Receive notifications about privacy updates by email</p>
        </div>
        <div className="mb-6">
          <div className="flex items-center">
            <label className="toggle-switch">
              <input type="checkbox" id="pushNotif" />
              <span className="toggle-slider"></span>
            </label>
            <label className="ml-3 block text-sm font-medium text-gray-700" htmlFor="pushNotif">
              Push Notifications
            </label>
          </div>
          <p className="mt-1 text-sm text-gray-500">Receive push notifications on your device</p>
        </div>
        
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
        
        <div className="flex justify-end mt-6">
          <button 
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
            type="button"
          >
            Save Settings
          </button>
        </div>
      </div>
      
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
    </div>
  );
};

export default SettingsPage; 
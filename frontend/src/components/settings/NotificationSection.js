import React from 'react';

const NotificationSection = () => {
  return (
    <div className="mb-6">
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
    </div>
  );
};

export default NotificationSection; 
import React from 'react';

const SettingsPage = () => {
  return (
    <div className="settings-page">
      <h2>Settings</h2>
      
      <div className="form-container">
        <h3 className="mb-3">Account Information</h3>
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">Full Name</label>
          <input type="text" className="form-control" id="fullName" placeholder="Enter your full name" />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input type="email" className="form-control" id="email" placeholder="Enter your email" />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="form-label">Phone Number</label>
          <input type="tel" className="form-control" id="phone" placeholder="Enter your phone number" />
        </div>
        
        <h3 className="mb-3">Notification Settings</h3>
        <div className="mb-3">
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="emailNotif" />
            <label className="form-check-label" htmlFor="emailNotif">
              Email Notifications
            </label>
          </div>
          <div className="form-text">Receive notifications about privacy updates by email</div>
        </div>
        <div className="mb-4">
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="pushNotif" />
            <label className="form-check-label" htmlFor="pushNotif">
              Push Notifications
            </label>
          </div>
          <div className="form-text">Receive push notifications on your device</div>
        </div>
        
        <h3 className="mb-3">Security</h3>
        <div className="mb-3">
          <button className="btn btn-outline-secondary" type="button">
            Change Password
          </button>
        </div>
        <div className="mb-3">
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="twoFactor" />
            <label className="form-check-label" htmlFor="twoFactor">
              Two-Factor Authentication
            </label>
          </div>
          <div className="form-text">Add an extra layer of security to your account</div>
        </div>
        
        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
          <button className="btn btn-primary" type="button">
            Save Settings
          </button>
        </div>
      </div>
      
      <div className="form-container mt-4">
        <h3 className="mb-3 text-danger">Danger Zone</h3>
        <p>These actions cannot be undone. Please proceed with caution.</p>
        
        <div className="d-grid gap-2 d-md-flex">
          <button className="btn btn-outline-danger" type="button">
            Delete Account
          </button>
          <button className="btn btn-outline-danger" type="button">
            Export All Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 
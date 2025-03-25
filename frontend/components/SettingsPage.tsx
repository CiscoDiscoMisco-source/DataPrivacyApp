import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { UserSettings } from '../types';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [deleteAccountConfirm, setDeleteAccountConfirm] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await ApiService.get<UserSettings>('/settings');
        setSettings(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch settings:', err);
        setError('Failed to load settings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  const saveSettings = async () => {
    if (!settings) return;
    
    try {
      setLoading(true);
      await ApiService.put<UserSettings>('/settings', settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setError(null);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError('Failed to save settings. Please try again.');
      setSaveSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const exportUserData = async () => {
    try {
      setExportLoading(true);
      const response = await ApiService.get<Record<string, any>>('/settings/export-data');
      const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-data.json';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export data:', err);
      setError('Failed to export data. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!deleteAccountConfirm) return;
    
    try {
      setLoading(true);
      await ApiService.delete('/settings/account');
      // Redirect to login or home page after successful deletion
      window.location.href = '/';
    } catch (err) {
      console.error('Failed to delete account:', err);
      setError('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (field: keyof UserSettings, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [field]: value
    });
  };
  
  if (loading && !settings) {
    return (
      <div className="flex justify-center py-10">
        <div className="inline-block animate-spin h-10 w-10 border-4 border-primary-light border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error && !settings) {
    return (
      <div className="glass-container bg-red-500/20 border-red-500/50 p-4" role="alert">
        <span className="font-medium text-red-100">{error}</span>
      </div>
    );
  }
  
  if (!settings) {
    return (
      <div className="glass-container p-4" role="alert">
        <p className="glass-text">No settings found. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <h2 className="glass-heading text-2xl">Settings</h2>
      
      <div className="glass-container p-6">
        {/* Account Section */}
        <div className="mb-8">
          <h3 className="glass-heading text-xl mb-4">Account Settings</h3>
          <div className="space-y-4">
            {saveSuccess && (
              <div className="glass-container bg-green-500/20 border-green-500/50 p-4" role="alert">
                <span className="font-medium text-green-100">Settings saved successfully!</span>
              </div>
            )}
            
            {error && (
              <div className="glass-container bg-red-500/20 border-red-500/50 p-4" role="alert">
                <span className="font-medium text-red-100">{error}</span>
              </div>
            )}
            
            <div className="glass-container p-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="notificationsEnabled"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => handleChange('notificationsEnabled', e.target.checked)}
                  className="h-5 w-5 text-primary-glow focus:ring-primary-glow border-primary-glow/30 rounded"
                />
                <label htmlFor="notificationsEnabled" className="ml-3 block glass-text font-semibold">
                  Enable notifications
                </label>
              </div>
              <p className="glass-text text-sm ml-8">Receive notifications about privacy changes from companies.</p>
            </div>
            
            <div className="glass-container p-4">
              <label htmlFor="emailFrequency" className="block glass-text font-semibold mb-2">
                Email frequency
              </label>
              <select
                id="emailFrequency"
                value={settings.emailFrequency}
                onChange={(e) => handleChange('emailFrequency', e.target.value)}
                className="glass-input"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="never">Never</option>
              </select>
            </div>
            
            <div className="glass-container p-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="darkMode"
                  checked={settings.darkMode}
                  onChange={(e) => handleChange('darkMode', e.target.checked)}
                  className="h-5 w-5 text-primary-glow focus:ring-primary-glow border-primary-glow/30 rounded"
                />
                <label htmlFor="darkMode" className="ml-3 block glass-text font-semibold">
                  Dark mode
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Notification Section */}
        <div className="mb-8">
          <h3 className="glass-heading text-xl mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <div className="glass-container p-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                  className="h-5 w-5 text-primary-glow focus:ring-primary-glow border-primary-glow/30 rounded"
                />
                <label htmlFor="emailNotifications" className="ml-3 block glass-text font-semibold">
                  Email notifications
                </label>
              </div>
              <p className="glass-text text-sm ml-8">Receive email notifications about your privacy settings.</p>
            </div>
            
            <div className="glass-container p-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="pushNotifications"
                  checked={settings.pushNotifications}
                  onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                  className="h-5 w-5 text-primary-glow focus:ring-primary-glow border-primary-glow/30 rounded"
                />
                <label htmlFor="pushNotifications" className="ml-3 block glass-text font-semibold">
                  Push notifications
                </label>
              </div>
              <p className="glass-text text-sm ml-8">Receive push notifications on your device.</p>
            </div>
          </div>
        </div>
        
        {/* Security Section */}
        <div className="mb-8">
          <h3 className="glass-heading text-xl mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div className="glass-container p-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                  className="h-5 w-5 text-primary-glow focus:ring-primary-glow border-primary-glow/30 rounded"
                />
                <label htmlFor="twoFactorAuth" className="ml-3 block glass-text font-semibold">
                  Two-factor authentication
                </label>
              </div>
              <p className="glass-text text-sm ml-8">Add an extra layer of security to your account.</p>
            </div>
            
            <div className="glass-container p-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="loginNotifications"
                  checked={settings.loginNotifications}
                  onChange={(e) => handleChange('loginNotifications', e.target.checked)}
                  className="h-5 w-5 text-primary-glow focus:ring-primary-glow border-primary-glow/30 rounded"
                />
                <label htmlFor="loginNotifications" className="ml-3 block glass-text font-semibold">
                  Login notifications
                </label>
              </div>
              <p className="glass-text text-sm ml-8">Get notified when someone logs into your account.</p>
            </div>
          </div>
        </div>
        
        {/* Data Management Section */}
        <div className="mb-8">
          <h3 className="glass-heading text-xl mb-4">Data Management</h3>
          <div className="space-y-4">
            <div className="glass-container p-4">
              <button
                onClick={exportUserData}
                disabled={exportLoading}
                className="glass-button"
              >
                {exportLoading ? (
                  <>
                    <span className="inline-block animate-spin h-4 w-4 mr-2 border-2 border-primary-light border-t-transparent rounded-full"></span>
                    Exporting...
                  </>
                ) : 'Export My Data'}
              </button>
            </div>
            
            <div className="glass-container p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="glass-text font-semibold mb-2">Delete Account</h4>
                  <p className="glass-text text-sm">Permanently delete your account and all associated data.</p>
                </div>
                <button
                  onClick={() => setDeleteAccountConfirm(true)}
                  className="glass-button bg-red-500/20 border-red-500/50 hover:bg-red-500/30"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-primary-glow/20">
          <button
            onClick={saveSettings}
            disabled={loading}
            className="glass-button"
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin h-4 w-4 mr-2 border-2 border-primary-light border-t-transparent rounded-full"></span>
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        </div>
      </div>
      
      {/* Delete Account Confirmation Modal */}
      {deleteAccountConfirm && (
        <div className="glass-modal">
          <div className="glass-modal-content">
            <h3 className="glass-heading text-xl mb-4">Delete Account</h3>
            <p className="glass-text mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteAccountConfirm(false)}
                className="glass-button"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                className="glass-button bg-red-500/20 border-red-500/50 hover:bg-red-500/30"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage; 
import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { UserSettings } from '../types';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  
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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (error && !settings) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-6" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }
  
  if (!settings) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded my-6" role="alert">
        <span className="block sm:inline">No settings found. Please try again later.</span>
      </div>
    );
  }
  
  return (
    <div className="settings-container">
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
      
      {saveSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded my-4" role="alert">
          <span className="block sm:inline">Settings saved successfully!</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="notificationsEnabled"
              checked={settings.notificationsEnabled}
              onChange={(e) => handleChange('notificationsEnabled', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="notificationsEnabled" className="ml-2 block text-sm text-gray-900">
              Enable notifications
            </label>
          </div>
          <p className="text-gray-500 text-sm ml-6">Receive notifications about privacy changes from companies.</p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="emailFrequency" className="block text-sm font-medium text-gray-700 mb-1">
            Email frequency
          </label>
          <select
            id="emailFrequency"
            value={settings.emailFrequency}
            onChange={(e) => handleChange('emailFrequency', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="never">Never</option>
          </select>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="darkMode"
              checked={settings.darkMode}
              onChange={(e) => handleChange('darkMode', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-900">
              Dark mode
            </label>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={saveSettings}
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 
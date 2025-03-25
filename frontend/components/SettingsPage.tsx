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
        <div className="inline-block animate-spin h-10 w-10 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error && !settings) {
    return (
      <div className="p-4 mb-4 neu-concave bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }
  
  if (!settings) {
    return (
      <div className="p-4 mb-4 neu-concave bg-primary-50 text-primary-800 rounded-lg border-l-4 border-primary-500" role="alert">
        <span className="block sm:inline">No settings found. Please try again later.</span>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-primary-800 heading-contrast mb-6">Settings</h2>
      
      <div className="neu-flat-contrast p-6 mb-8">
        {/* Account Section */}
        <div className="mb-8">
          <h3 className="text-xl font-medium text-primary-800 mb-4 pb-2 border-b-2 border-primary-300">Account Settings</h3>
          <div className="space-y-4">
            {saveSuccess && (
              <div className="p-4 neu-concave bg-green-50 text-green-700 rounded-lg border-l-4 border-green-500" role="alert">
                <span className="block sm:inline font-medium">Settings saved successfully!</span>
              </div>
            )}
            
            {error && (
              <div className="p-4 neu-concave bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500" role="alert">
                <span className="block sm:inline font-medium">{error}</span>
              </div>
            )}
            
            <div className="mb-4 p-4 neu-flat-contrast">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="notificationsEnabled"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => handleChange('notificationsEnabled', e.target.checked)}
                  className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-primary-400 rounded shadow-neu-pressed"
                />
                <label htmlFor="notificationsEnabled" className="ml-3 block text-primary-800 font-semibold">
                  Enable notifications
                </label>
              </div>
              <p className="text-gray-700 text-sm ml-8">Receive notifications about privacy changes from companies.</p>
            </div>
            
            <div className="mb-4 p-4 neu-flat-contrast">
              <label htmlFor="emailFrequency" className="block text-primary-800 font-semibold mb-2">
                Email frequency
              </label>
              <select
                id="emailFrequency"
                value={settings.emailFrequency}
                onChange={(e) => handleChange('emailFrequency', e.target.value)}
                className="neu-input-contrast"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="never">Never</option>
              </select>
            </div>
            
            <div className="mb-4 p-4 neu-flat-contrast">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="darkMode"
                  checked={settings.darkMode}
                  onChange={(e) => handleChange('darkMode', e.target.checked)}
                  className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-primary-400 rounded shadow-neu-pressed"
                />
                <label htmlFor="darkMode" className="ml-3 block text-primary-800 font-semibold">
                  Dark mode
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Notification Section */}
        <div className="mb-8">
          <h3 className="text-xl font-medium text-primary-800 mb-4 pb-2 border-b-2 border-primary-300">Notification Settings</h3>
          <div className="p-4 neu-flat-contrast text-gray-700">
            <p className="font-medium">Notification settings will be implemented soon.</p>
          </div>
        </div>
        
        {/* Security Section */}
        <div className="mb-8">
          <h3 className="text-xl font-medium text-primary-800 mb-4 pb-2 border-b-2 border-primary-300">Security Settings</h3>
          <div className="p-4 neu-flat-contrast text-gray-700">
            <p className="font-medium">Security settings will be implemented soon.</p>
          </div>
        </div>
        
        <div className="flex justify-end mt-8 pt-4 border-t-2 border-primary-300">
          <button
            type="button"
            onClick={saveSettings}
            disabled={loading}
            className={`neu-button-contrast ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
      
      {/* Danger Zone Section */}
      <div className="neu-flat-contrast p-6 border-2 border-red-300">
        <h3 className="text-xl font-medium text-red-700 mb-4 pb-2 border-b-2 border-red-300">Danger Zone</h3>
        <p className="text-gray-700 mb-4 font-medium">
          Actions here can't be undone. Please proceed with caution.
        </p>
        <div className="p-4 neu-flat-contrast text-gray-700 border-l-4 border-red-400">
          <p className="font-medium">Danger zone actions will be implemented soon.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 
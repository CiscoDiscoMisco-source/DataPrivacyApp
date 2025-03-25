import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { UserPreference, UserProfilePreference, Company } from '../types';

interface PreferencesApiResponse {
  data_preferences: UserPreference[];
  profile_preferences: UserProfilePreference | null;
}

const PreferencesPage: React.FC = () => {
  const [dataPreferences, setDataPreferences] = useState<UserPreference[]>([]);
  const [profilePreferences, setProfilePreferences] = useState<UserProfilePreference | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const response = await ApiService.get<PreferencesApiResponse>('/user-preferences');
        setDataPreferences(response.data_preferences);
        setProfilePreferences(response.profile_preferences);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch preferences:', err);
        setError('Failed to load your preferences. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const updatePreference = async (preferenceId: string, allowed: boolean) => {
    try {
      setLoading(true);
      await ApiService.put<UserPreference>(`/user-preferences/data/${preferenceId}`, { allowed });
      
      // Refresh the list after update
      const response = await ApiService.get<PreferencesApiResponse>('/user-preferences');
      setDataPreferences(response.data_preferences);
      setProfilePreferences(response.profile_preferences);
      setError(null);
    } catch (err) {
      console.error('Failed to update preference:', err);
      setError('Failed to update preference. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Privacy Preferences</h2>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <p className="text-gray-600 mb-6">
          Manage your global privacy preferences across all companies. 
          These settings will be applied as defaults when a new company is added to the system.
        </p>
        
        {/* Profile Preferences Section */}
        {profilePreferences && (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Notification Preferences</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="email-notifications"
                    checked={profilePreferences.email_notifications}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    // Will implement handler later
                    onChange={() => {}}
                  />
                  <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-900">
                    Receive email notifications
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Privacy Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto-delete"
                    checked={profilePreferences.auto_delete_data}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    // Will implement handler later
                    onChange={() => {}}
                  />
                  <label htmlFor="auto-delete" className="ml-2 block text-sm text-gray-900">
                    Auto-delete my data
                  </label>
                </div>
              </div>
            </div>
          </>
        )}
        
        <div className="flex justify-end mt-6">
          <button 
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
            type="button"
          >
            Save Preferences
          </button>
        </div>
      </div>
      
      {/* Data Type Preferences List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Data Sharing Preferences</h3>
        <p className="text-gray-600 mb-4">
          Control how your data is shared with companies.
        </p>
        <div className="space-y-4">
          {dataPreferences.map((preference) => (
            <div key={preference.id} className="bg-white shadow rounded-lg p-4">
              <h3 className="text-xl font-semibold">{preference.company?.name || 'Global Setting'}</h3>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`data-sharing-${preference.id}`}
                    checked={preference.allowed}
                    onChange={(e) => updatePreference(preference.id, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`data-sharing-${preference.id}`} className="ml-2 block text-sm text-gray-900">
                    Allow data sharing
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage; 
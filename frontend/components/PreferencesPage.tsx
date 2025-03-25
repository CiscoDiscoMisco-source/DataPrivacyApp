import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { UserPreference, UserProfilePreference, Company } from '../types';
import { useRouter } from 'next/router';

interface PreferencesApiResponse {
  data_preferences: UserPreference[];
  profile_preferences: UserProfilePreference | null;
}

const PreferencesPage: React.FC = () => {
  const router = useRouter();
  const { companyId } = router.query;
  const [dataPreferences, setDataPreferences] = useState<UserPreference[]>([]);
  const [profilePreferences, setProfilePreferences] = useState<UserProfilePreference | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const response = await ApiService.get<PreferencesApiResponse>(
          companyId ? `/user-preferences?company_id=${companyId}` : '/user-preferences'
        );
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
  }, [companyId]);

  const updatePreference = async (preferenceId: string, allowed: boolean) => {
    try {
      setLoading(true);
      await ApiService.put<UserPreference>(`/user-preferences/data/${preferenceId}`, { allowed });
      
      // Refresh the list after update
      const response = await ApiService.get<PreferencesApiResponse>(
        companyId ? `/user-preferences?company_id=${companyId}` : '/user-preferences'
      );
      setDataPreferences(response.data_preferences);
      setProfilePreferences(response.profile_preferences);
      setError(null);
      setSuccessMessage('Preferences updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update preference:', err);
      setError('Failed to update preference. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateProfilePreferences = async (updates: Partial<UserProfilePreference>) => {
    try {
      setLoading(true);
      await ApiService.put('/user-preferences/profile', updates);
      const response = await ApiService.get<PreferencesApiResponse>('/user-preferences');
      setProfilePreferences(response.profile_preferences);
      setError(null);
      setSuccessMessage('Profile preferences updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update profile preferences:', err);
      setError('Failed to update profile preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          {companyId ? 'Company Privacy Preferences' : 'My Privacy Preferences'}
        </h1>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4" role="alert">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            {companyId 
              ? 'Manage your privacy preferences for this specific company.'
              : 'Manage your global privacy preferences across all companies. These settings will be applied as defaults when a new company is added to the system.'}
          </p>

          {/* Profile Preferences Section */}
          {profilePreferences && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="email-notifications"
                      checked={profilePreferences.email_notifications}
                      onChange={(e) => updateProfilePreferences({ email_notifications: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="email-notifications" className="ml-2 text-sm text-gray-700">
                      Receive email notifications
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="auto-delete"
                      checked={profilePreferences.auto_delete_data}
                      onChange={(e) => updateProfilePreferences({ auto_delete_data: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="auto-delete" className="ml-2 text-sm text-gray-700">
                      Auto-delete my data
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Type Preferences List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Data Sharing Preferences</h3>
          <p className="text-gray-600 mb-6">
            Control how your data is shared with companies.
          </p>
          <div className="space-y-4">
            {dataPreferences.map((preference) => (
              <div 
                key={preference.id} 
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">
                    {preference.company?.name || 'Global Setting'}
                  </h4>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`data-sharing-${preference.id}`}
                      checked={preference.allowed}
                      onChange={(e) => updatePreference(preference.id, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label 
                      htmlFor={`data-sharing-${preference.id}`} 
                      className="ml-2 text-sm text-gray-700"
                    >
                      Allow data sharing
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage; 
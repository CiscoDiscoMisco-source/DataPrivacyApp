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
        <div className="inline-block animate-spin h-10 w-10 border-4 border-primary-light border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-container bg-red-500/20 border-red-500/50 p-4" role="alert">
        <span className="font-medium text-red-100">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="glass-heading text-2xl">
          {companyId ? 'Company Privacy Preferences' : 'My Privacy Preferences'}
        </h1>
      </div>

      {successMessage && (
        <div className="glass-container bg-green-500/20 border-green-500/50 p-4" role="alert">
          <span className="font-medium text-green-100">{successMessage}</span>
        </div>
      )}

      <div className="glass-container p-6">
        <p className="glass-text mb-6">
          {companyId 
            ? 'Manage your privacy preferences for this specific company.'
            : 'Manage your global privacy preferences across all companies. These settings will be applied as defaults when a new company is added to the system.'}
        </p>

        {/* Profile Preferences Section */}
        {profilePreferences && (
          <div className="space-y-6">
            <div>
              <h3 className="glass-heading text-xl mb-4">Notification Preferences</h3>
              <div className="glass-container p-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="email-notifications"
                    checked={profilePreferences.email_notifications}
                    onChange={(e) => updateProfilePreferences({ email_notifications: e.target.checked })}
                    className="h-5 w-5 text-primary-glow focus:ring-primary-glow border-primary-glow/30 rounded"
                  />
                  <label htmlFor="email-notifications" className="ml-3 glass-text font-semibold">
                    Receive email notifications
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="glass-heading text-xl mb-4">Privacy Settings</h3>
              <div className="glass-container p-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto-delete"
                    checked={profilePreferences.auto_delete_data}
                    onChange={(e) => updateProfilePreferences({ auto_delete_data: e.target.checked })}
                    className="h-5 w-5 text-primary-glow focus:ring-primary-glow border-primary-glow/30 rounded"
                  />
                  <label htmlFor="auto-delete" className="ml-3 glass-text font-semibold">
                    Auto-delete my data
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Data Type Preferences List */}
      <div className="glass-container p-6">
        <h3 className="glass-heading text-xl mb-4">Data Sharing Preferences</h3>
        <p className="glass-text mb-6">
          Control how your data is shared with companies.
        </p>
        <div className="space-y-4">
          {dataPreferences.map((preference) => (
            <div 
              key={preference.id} 
              className="glass-container p-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="glass-text font-semibold">
                  {preference.company?.name || 'Global Setting'}
                </h4>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`data-sharing-${preference.id}`}
                    checked={preference.allowed}
                    onChange={(e) => updatePreference(preference.id, e.target.checked)}
                    className="h-5 w-5 text-primary-glow focus:ring-primary-glow border-primary-glow/30 rounded"
                  />
                  <label 
                    htmlFor={`data-sharing-${preference.id}`} 
                    className="ml-3 glass-text font-semibold"
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
  );
};

export default PreferencesPage; 
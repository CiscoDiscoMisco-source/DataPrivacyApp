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

  return (
    <div>
      <h2 className="glass-heading text-2xl mb-6">
        {companyId ? 'Company Privacy Preferences' : 'My Privacy Preferences'}
      </h2>
      
      {successMessage && (
        <div className="glass p-4 mb-4 text-green-100 rounded-lg" role="alert">
          {successMessage}
        </div>
      )}
      
      <div className="glass-card p-6 mb-6">
        <p className="glass-text mb-6">
          {companyId 
            ? 'Manage your privacy preferences for this specific company.'
            : 'Manage your global privacy preferences across all companies. These settings will be applied as defaults when a new company is added to the system.'}
        </p>
        
        {/* Profile Preferences Section */}
        {profilePreferences && (
          <>
            <div className="mb-6">
              <h3 className="glass-heading text-lg mb-3">Notification Preferences</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="email-notifications"
                    checked={profilePreferences.email_notifications}
                    className="h-4 w-4 text-primary-300 focus:ring-primary-300 border-primary-300/30 rounded"
                    onChange={(e) => updateProfilePreferences({ email_notifications: e.target.checked })}
                  />
                  <label htmlFor="email-notifications" className="ml-2 block text-sm glass-text">
                    Receive email notifications
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="glass-heading text-lg mb-3">Privacy Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto-delete"
                    checked={profilePreferences.auto_delete_data}
                    className="h-4 w-4 text-primary-300 focus:ring-primary-300 border-primary-300/30 rounded"
                    onChange={(e) => updateProfilePreferences({ auto_delete_data: e.target.checked })}
                  />
                  <label htmlFor="auto-delete" className="ml-2 block text-sm glass-text">
                    Auto-delete my data
                  </label>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Data Type Preferences List */}
      <div className="glass-card p-6">
        <h3 className="glass-heading text-lg mb-4">Data Sharing Preferences</h3>
        <p className="glass-text mb-4">
          Control how your data is shared with companies.
        </p>
        <div className="space-y-4">
          {dataPreferences.map((preference) => (
            <div key={preference.id} className="glass p-4">
              <h3 className="glass-heading text-xl">{preference.company?.name || 'Global Setting'}</h3>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`data-sharing-${preference.id}`}
                    checked={preference.allowed}
                    onChange={(e) => updatePreference(preference.id, e.target.checked)}
                    className="h-4 w-4 text-primary-300 focus:ring-primary-300 border-primary-300/30 rounded"
                  />
                  <label htmlFor={`data-sharing-${preference.id}`} className="ml-2 block text-sm glass-text">
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
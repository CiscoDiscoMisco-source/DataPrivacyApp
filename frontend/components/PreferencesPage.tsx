import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { UserPreference, Company } from '../types';

const PreferencesPage: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const data = await ApiService.get<UserPreference[]>('/preferences');
        setPreferences(data);
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

  const updatePreference = async (preferenceId: string, updates: Partial<UserPreference>) => {
    try {
      setLoading(true);
      await ApiService.put<UserPreference>(`/preferences/${preferenceId}`, updates);
      
      // Refresh the list after update
      const updatedPreferences = await ApiService.get<UserPreference[]>('/preferences');
      setPreferences(updatedPreferences);
      setError(null);
    } catch (err) {
      console.error('Failed to update preference:', err);
      setError('Failed to update preference. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="preferences-container">
      <h2 className="text-2xl font-bold mb-4">Your Privacy Preferences</h2>
      
      {loading && (
        <div className="flex justify-center py-5">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-3" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {!loading && !error && preferences.length === 0 && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded my-3" role="alert">
          <span className="block sm:inline">You don't have any preferences set yet.</span>
        </div>
      )}
      
      <div className="space-y-4">
        {preferences.map((preference) => (
          <div key={preference.id} className="bg-white shadow rounded-lg p-4">
            <h3 className="text-xl font-semibold">{preference.company?.name || 'Unknown Company'}</h3>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`data-sharing-${preference.id}`}
                  checked={preference.allowDataSharing}
                  onChange={(e) => updatePreference(preference.id, { allowDataSharing: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`data-sharing-${preference.id}`} className="ml-2 block text-sm text-gray-900">
                  Allow data sharing
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`marketing-${preference.id}`}
                  checked={preference.allowMarketing}
                  onChange={(e) => updatePreference(preference.id, { allowMarketing: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`marketing-${preference.id}`} className="ml-2 block text-sm text-gray-900">
                  Allow marketing communications
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`profiling-${preference.id}`}
                  checked={preference.allowProfiling}
                  onChange={(e) => updatePreference(preference.id, { allowProfiling: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`profiling-${preference.id}`} className="ml-2 block text-sm text-gray-900">
                  Allow user profiling
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreferencesPage; 
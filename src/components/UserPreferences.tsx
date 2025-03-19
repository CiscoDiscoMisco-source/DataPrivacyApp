import React, { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext';
import './UserPreferences.css';

const UserPreferences: React.FC = () => {
  const { client, loading, error } = useData();
  const [preferences, setPreferences] = useState<any[]>([]);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const result = await client.models.UserPreferences.list();
        setPreferences(result.data as any[]);
      } catch (err) {
        console.error('Error fetching user preferences:', err);
      }
    };

    fetchPreferences();
  }, [client]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="user-preferences">
      <h2>User Preferences</h2>
      <div className="preferences-grid">
        {preferences.map((pref) => (
          <div key={pref.id} className="preference-card">
            <div className="preference-header">
              <h3>User ID: {pref.userId}</h3>
            </div>
            <div className="preference-details">
              <div className="preference-section">
                <h4>Notification Settings</h4>
                <p>Email Notifications: {pref.emailNotifications ? 'Enabled' : 'Disabled'}</p>
                <p>Frequency: {pref.notificationFrequency}</p>
                {pref.notificationTypes && (
                  <div className="notification-types">
                    <h5>Notification Types:</h5>
                    <pre>{JSON.stringify(pref.notificationTypes, null, 2)}</pre>
                  </div>
                )}
              </div>
              
              <div className="preference-section">
                <h4>Data Privacy Settings</h4>
                <p>Privacy Level: {pref.privacyLevel}</p>
                <p>Auto Delete Data: {pref.autoDeleteData ? 'Yes' : 'No'}</p>
                {pref.dataRetentionPeriod && (
                  <p>Data Retention Period: {pref.dataRetentionPeriod} days</p>
                )}
                {pref.dataSharingPreferences && (
                  <div className="data-sharing-prefs">
                    <h5>Data Sharing Preferences:</h5>
                    <pre>{JSON.stringify(pref.dataSharingPreferences, null, 2)}</pre>
                  </div>
                )}
              </div>
              
              <div className="preference-section">
                <h4>UI Preferences</h4>
                <p>Theme: {pref.theme}</p>
                <p>Language: {pref.language}</p>
                {pref.timezone && <p>Timezone: {pref.timezone}</p>}
              </div>
              
              <div className="preference-meta">
                <p>Created: {new Date(pref.createdAt).toLocaleDateString()}</p>
                {pref.updatedAt && <p>Last Updated: {new Date(pref.updatedAt).toLocaleDateString()}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPreferences; 
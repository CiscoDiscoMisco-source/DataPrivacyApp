import React, { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { client, loading, error } = useData();
  const [stats, setStats] = useState({
    users: 0,
    companies: 0,
    dataTypes: 0,
    dataSharing: 0,
    preferences: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersResult = await client.models.User.list();
        const companiesResult = await client.models.Company.list();
        const dataTypesResult = await client.models.DataType.list();
        const dataSharingResult = await client.models.DataSharingTerm.list();
        const preferencesResult = await client.models.UserPreferences.list();

        setStats({
          users: usersResult.data.length,
          companies: companiesResult.data.length,
          dataTypes: dataTypesResult.data.length,
          dataSharing: dataSharingResult.data.length,
          preferences: preferencesResult.data.length
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };

    fetchStats();
  }, [client]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Users</h3>
          <div className="stat-value">{stats.users}</div>
        </div>
        
        <div className="stat-card">
          <h3>Companies</h3>
          <div className="stat-value">{stats.companies}</div>
        </div>
        
        <div className="stat-card">
          <h3>Data Types</h3>
          <div className="stat-value">{stats.dataTypes}</div>
        </div>
        
        <div className="stat-card">
          <h3>Data Sharing Terms</h3>
          <div className="stat-value">{stats.dataSharing}</div>
        </div>
        
        <div className="stat-card">
          <h3>User Preferences</h3>
          <div className="stat-value">{stats.preferences}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
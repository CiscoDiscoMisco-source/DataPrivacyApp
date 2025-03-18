import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { currentUser } = useAuth();
  
  useEffect(() => {
    // Load user's companies and preferences
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user's companies with data sharing terms
        const companiesResponse = await api.getUserCompanies();
        
        // Fetch global preferences
        const preferencesResponse = await api.getPreferences({ global: true });
        
        setCompanies(companiesResponse.data.data || []);
        setPreferences(preferencesResponse.data.data || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }
  
  return (
    <div className="dashboard">
      <h1>Welcome, {currentUser?.username}</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Your Privacy Summary</h3>
          <div className="summary-stats">
            <div className="stat">
              <span className="stat-value">{companies.length}</span>
              <span className="stat-label">Companies</span>
            </div>
            <div className="stat">
              <span className="stat-value">{preferences.length}</span>
              <span className="stat-label">Global Preferences</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <Link to="/companies" className="btn-primary">View Companies</Link>
          <Link to="/preferences" className="btn-primary">Manage Preferences</Link>
        </div>
      </div>
      
      {companies.length > 0 && (
        <div className="recent-companies">
          <h3>Recent Companies</h3>
          <div className="company-list">
            {companies.slice(0, 3).map((companyData) => (
              <div key={companyData.company.company_id} className="company-card">
                <h4>{companyData.company.name}</h4>
                <p>{companyData.company.description || 'No description available'}</p>
                <p><strong>Domain:</strong> {companyData.company.domain}</p>
                <p><strong>Data Sharing Terms:</strong> {companyData.terms.length} terms</p>
                <Link to={`/companies/${companyData.company.company_id}`} className="btn-secondary">
                  View Details
                </Link>
              </div>
            ))}
          </div>
          {companies.length > 3 && (
            <Link to="/companies" className="view-all">
              View all companies ({companies.length})
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 
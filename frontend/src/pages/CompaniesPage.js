import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const CompaniesPage = ({ searchTerm }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load initial companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const data = await ApiService.get('/companies');
        setCompanies(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch companies:', err);
        setError('Failed to load companies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanies();
  }, []);
  
  // Handle search term changes
  useEffect(() => {
    const searchCompanies = async () => {
      if (!searchTerm || searchTerm.length <= 2) {
        // Load all companies if search term is too short
        if (companies.length === 0) {
          // Only reload if we don't already have companies
          const data = await ApiService.get('/companies');
          setCompanies(data);
        }
        return;
      }
      
      try {
        setLoading(true);
        const data = await ApiService.get('/companies', { search: searchTerm });
        setCompanies(data);
      } catch (err) {
        console.error('Search failed:', err);
        setError('Search failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    // Use debounce to avoid too many API calls
    const debounceTimeout = setTimeout(() => {
      searchCompanies();
    }, 500);
    
    // Cleanup function to clear timeout
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);
  
  const handleViewDetails = (companyId) => {
    console.log('View company details:', companyId);
    // Implementation will be added later
  };
  
  const handleManagePreferences = (companyId) => {
    console.log('Manage preferences:', companyId);
    // Implementation will be added later
  };
  
  return (
    <div className="company-list">
      <h2>Companies with your data</h2>
      
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger m-3" role="alert">
          {error}
        </div>
      )}
      
      {!loading && !error && companies.length === 0 && (
        <div className="alert alert-info m-3" role="alert">
          No companies found.
        </div>
      )}
      
      <div className="row">
        {companies.map(company => (
          <div className="col-md-6 col-lg-4 mb-4" key={company.id}>
            <div className="company-card">
              <h3>{company.name}</h3>
              <p>{company.description || 'No description available'}</p>
              <div className="d-flex justify-content-between mt-3">
                <button 
                  className="btn btn-sm btn-outline-secondary" 
                  onClick={() => handleViewDetails(company.id)}
                >
                  View Details
                </button>
                <button 
                  className="btn btn-sm btn-primary" 
                  onClick={() => handleManagePreferences(company.id)}
                >
                  Manage Preferences
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompaniesPage; 
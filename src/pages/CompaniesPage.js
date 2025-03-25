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
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Companies with your data</h2>
        <span className="text-sm text-gray-500">{companies.length} companies found</span>
      </div>
      
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full spin"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && companies.length === 0 && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
          <p>No companies found. Try adjusting your search criteria.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map(company => (
          <div key={company.id}>
            <div className="company-card">
              <h3 className="text-xl font-medium text-gray-900 mb-2">{company.name}</h3>
              <p className="text-gray-600 mb-4">{company.description || 'No description available'}</p>
              <div className="flex justify-between mt-auto pt-4">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm"
                  onClick={() => handleViewDetails(company.id)}
                >
                  View Details
                </button>
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm"
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
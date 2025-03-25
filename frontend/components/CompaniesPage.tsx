import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { Company } from '../types';

interface CompaniesPageProps {
  searchTerm?: string;
}

const CompaniesPage: React.FC<CompaniesPageProps> = ({ searchTerm }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load initial companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const data = await ApiService.get<Company[]>('/companies');
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
          const data = await ApiService.get<Company[]>('/companies');
          setCompanies(data);
        }
        return;
      }
      
      try {
        setLoading(true);
        const data = await ApiService.get<Company[]>('/companies', { search: searchTerm });
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
  }, [searchTerm, companies.length]);
  
  const handleViewDetails = (companyId: string) => {
    console.log('View company details:', companyId);
    // Implementation will be added later
  };
  
  const handleManagePreferences = (companyId: string) => {
    console.log('Manage preferences:', companyId);
    // Implementation will be added later
  };
  
  return (
    <div className="company-list">
      <h2 className="text-2xl font-bold mb-4">Companies with your data</h2>
      
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
      
      {!loading && !error && companies.length === 0 && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded my-3" role="alert">
          <span className="block sm:inline">No companies found.</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map(company => (
          <div className="bg-white shadow rounded-lg p-4" key={company.id}>
            <h3 className="text-xl font-semibold">{company.name}</h3>
            <p className="text-gray-600 mt-2">{company.description || 'No description available'}</p>
            <div className="flex justify-between mt-4">
              <button 
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition" 
                onClick={() => handleViewDetails(company.id)}
              >
                View Details
              </button>
              <button 
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition" 
                onClick={() => handleManagePreferences(company.id)}
              >
                Manage Preferences
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompaniesPage; 
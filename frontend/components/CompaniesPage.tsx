import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import AddCompanyForm from './AddCompanyForm';

interface Company {
  id: string;
  name: string;
  description?: string;
}

interface CompaniesResponse {
  companies: Company[];
}

interface CompaniesPageProps {
  searchTerm?: string;
}

const CompaniesPage: React.FC<CompaniesPageProps> = ({ searchTerm }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingCompany, setIsAddingCompany] = useState<boolean>(false);
  
  // Load initial companies
  useEffect(() => {
    const fetchCompanies = async (): Promise<void> => {
      try {
        setLoading(true);
        const data = await ApiService.get<CompaniesResponse>('/companies');
        setCompanies(data.companies);
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
    const searchCompanies = async (): Promise<void> => {
      if (!searchTerm || searchTerm.length <= 2) {
        // Load all companies if search term is too short
        if (companies.length === 0) {
          // Only reload if we don't already have companies
          const data = await ApiService.get<CompaniesResponse>('/companies');
          setCompanies(data.companies);
        }
        return;
      }
      
      try {
        setLoading(true);
        const data = await ApiService.get<CompaniesResponse>('/companies', { search: searchTerm });
        setCompanies(data.companies);
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
  
  const handleViewDetails = (companyId: string): void => {
    console.log('View company details:', companyId);
    // Implementation will be added later
  };
  
  const handleManagePreferences = (companyId: string): void => {
    console.log('Manage preferences:', companyId);
    // Implementation will be added later
  };
  
  const handleAddCompanySuccess = (): void => {
    // Refresh the company list
    setIsAddingCompany(false);
    setLoading(true);
    ApiService.get<CompaniesResponse>('/companies')
      .then(data => {
        setCompanies(data.companies);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to refresh companies:', err);
        setError('Failed to refresh company list.');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6 pb-3 border-b-2 border-primary-300">
        <h2 className="text-2xl font-bold text-primary-800 heading-contrast">Companies with your data</h2>
        <button 
          className="neu-button-contrast" 
          onClick={() => setIsAddingCompany(true)}
          disabled={isAddingCompany}
        >
          Add Company Manually
        </button>
      </div>
      
      {isAddingCompany && (
        <div className="mb-8">
          <AddCompanyForm 
            onSuccess={handleAddCompanySuccess} 
            onCancel={() => setIsAddingCompany(false)} 
          />
        </div>
      )}
      
      {loading && !isAddingCompany && (
        <div className="flex justify-center py-10">
          <div className="inline-block animate-spin h-10 w-10 border-4 border-primary-600 border-t-transparent rounded-full" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="p-4 mb-4 neu-concave bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500" role="alert">
          {error}
        </div>
      )}
      
      {!loading && !error && companies.length === 0 && !isAddingCompany && (
        <div className="p-4 mb-4 neu-concave bg-primary-50 text-primary-800 rounded-lg border-l-4 border-primary-500" role="alert">
          No companies found. You can add a company manually using the button above.
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map(company => (
          <div className="neu-card-contrast p-5" key={company.id}>
            <h3 className="text-xl font-semibold text-primary-800 mb-2 pb-2 border-b border-primary-300">{company.name}</h3>
            <p className="text-gray-700 mb-4">{company.description || 'No description available'}</p>
            <div className="flex justify-between mt-4 pt-3 border-t border-primary-200">
              <button 
                className="neu-button bg-primary-50 text-primary-700 border border-primary-300"
                onClick={() => handleViewDetails(company.id)}
              >
                View Details
              </button>
              <button 
                className="neu-button-contrast" 
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
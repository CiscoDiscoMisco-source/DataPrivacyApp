import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import AddCompanyForm from './AddCompanyForm';
import { useRouter } from 'next/router';

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
  const router = useRouter();
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
    router.push(`/companies/${companyId}`);
  };
  
  const handleManagePreferences = (companyId: string): void => {
    router.push(`/preferences/${companyId}`);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-primary-glow/20">
        <h2 className="glass-heading text-2xl">Companies with your data</h2>
        <button 
          className="glass-button" 
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
          <div className="inline-block animate-spin h-10 w-10 border-4 border-primary-light border-t-transparent rounded-full" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="glass-container bg-red-500/20 border-red-500/50 p-4" role="alert">
          <span className="font-medium text-red-100">{error}</span>
        </div>
      )}
      
      {!loading && !error && companies.length === 0 && !isAddingCompany && (
        <div className="glass-container p-4" role="alert">
          <p className="glass-text">No companies found. You can add a company manually using the button above.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map(company => (
          <div className="glass-container p-6" key={company.id}>
            <h3 className="glass-heading text-xl mb-3">{company.name}</h3>
            <p className="glass-text mb-6">{company.description || 'No description available'}</p>
            <div className="flex justify-between pt-4 border-t border-primary-glow/20">
              <button 
                className="glass-button"
                onClick={() => handleViewDetails(company.id)}
              >
                View Details
              </button>
              <button 
                className="glass-button" 
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
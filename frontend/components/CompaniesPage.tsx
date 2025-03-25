import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import AddCompanyForm from './AddCompanyForm';
import { useRouter } from 'next/router';
import Layout from './Layout';

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
        setError(null);
        const data = await ApiService.get<CompaniesResponse>('/companies');
        setCompanies(data.companies);
      } catch (err: any) {
        console.error('Failed to fetch companies:', err);
        setError(err.message || 'Failed to load companies. Please try again later.');
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
          try {
            // Only reload if we don't already have companies
            setLoading(true);
            setError(null);
            const data = await ApiService.get<CompaniesResponse>('/companies');
            setCompanies(data.companies);
          } catch (err: any) {
            console.error('Failed to fetch companies:', err);
            setError(err.message || 'Failed to load companies. Please try again later.');
          } finally {
            setLoading(false);
          }
        }
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const data = await ApiService.get<CompaniesResponse>('/companies', { search: searchTerm });
        setCompanies(data.companies);
      } catch (err: any) {
        console.error('Search failed:', err);
        setError(err.message || 'Search failed. Please try again.');
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
    <Layout title="Companies">
      <div className="space-y-8">
        <div className="glass-container">
          <div className="flex justify-between items-center">
            <h2 className="glass-heading text-2xl m-0">Companies with your data</h2>
            <button 
              className="glass-button"
              onClick={() => setIsAddingCompany(true)}
              disabled={isAddingCompany}
            >
              Add Company Manually
            </button>
          </div>
        </div>
        
        {isAddingCompany && (
          <div className="glass-container">
            <AddCompanyForm 
              onSuccess={handleAddCompanySuccess} 
              onCancel={() => setIsAddingCompany(false)} 
            />
          </div>
        )}
        
        {loading && !isAddingCompany && (
          <div className="glass-container flex justify-center py-10">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-primary-200/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-primary-500 animate-spin rounded-full"></div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="glass-container bg-red-900/30 border-red-500/30" role="alert">
            <p className="glass-text text-red-100">{error}</p>
          </div>
        )}
        
        {!loading && !error && companies.length === 0 && !isAddingCompany && (
          <div className="glass-container" role="alert">
            <div className="flex flex-col items-center space-y-4">
              <p className="glass-text text-center">No companies found in your privacy management list.</p>
              <button 
                className="glass-button bg-primary-500/20 hover:bg-primary-500/30"
                onClick={() => setIsAddingCompany(true)}
              >
                Add Your First Company
              </button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map(company => (
            <div className="glass-card group hover:shadow-glass-highlight transition-all duration-300" key={company.id}>
              <h3 className="glass-heading text-xl mb-3">{company.name}</h3>
              <p className="glass-text mb-6 line-clamp-2">{company.description || 'No description available'}</p>
              <div className="flex justify-between space-x-4 pt-4 border-t border-primary-400/20">
                <button 
                  className="glass-button flex-1 text-sm px-4"
                  onClick={() => handleViewDetails(company.id)}
                >
                  View Details
                </button>
                <button 
                  className="glass-button flex-1 text-sm px-4" 
                  onClick={() => handleManagePreferences(company.id)}
                >
                  Manage Preferences
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CompaniesPage; 
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
    <div className="company-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Companies with your data</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setIsAddingCompany(true)}
          disabled={isAddingCompany}
        >
          Add Company Manually
        </button>
      </div>
      
      {isAddingCompany && (
        <div className="mb-4">
          <AddCompanyForm 
            onSuccess={handleAddCompanySuccess} 
            onCancel={() => setIsAddingCompany(false)} 
          />
        </div>
      )}
      
      {loading && !isAddingCompany && (
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
      
      {!loading && !error && companies.length === 0 && !isAddingCompany && (
        <div className="alert alert-info m-3" role="alert">
          No companies found. You can add a company manually using the button above.
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
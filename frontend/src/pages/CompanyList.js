import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);
  
  // Load user's companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await api.getUserCompanies();
        setCompanies(response.data.data || []);
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('Failed to load companies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanies();
  }, []);
  
  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }
    
    try {
      setSearching(true);
      const response = await api.searchCompanies(searchQuery);
      setSearchResults(response.data.data || []);
    } catch (err) {
      console.error('Error searching companies:', err);
      setError('Failed to search companies. Please try again.');
    } finally {
      setSearching(false);
    }
  };
  
  // Reset search
  const handleResetSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };
  
  // Render company card
  const renderCompanyCard = (company) => {
    // For search results, the company object structure is different
    const companyData = company.company || company;
    const terms = company.terms || [];
    
    return (
      <div key={companyData.company_id} className="company-card">
        <h3>{companyData.name}</h3>
        <p>{companyData.description || 'No description available'}</p>
        <p><strong>Domain:</strong> {companyData.domain}</p>
        {terms.length > 0 && (
          <p><strong>Data Sharing Terms:</strong> {terms.length} terms</p>
        )}
        <Link 
          to={`/companies/${companyData.company_id}`} 
          className="btn-primary"
        >
          View Details
        </Link>
      </div>
    );
  };
  
  if (loading) {
    return <div className="loading">Loading companies...</div>;
  }
  
  return (
    <div className="company-list-page">
      <h1>Companies</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search companies..."
            className="search-input"
          />
          <button 
            type="submit" 
            className="btn-primary"
            disabled={searching || !searchQuery.trim()}
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
          
          {searchResults.length > 0 && (
            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleResetSearch}
            >
              Clear Search
            </button>
          )}
        </form>
      </div>
      
      {/* Show search results if available */}
      {searchResults.length > 0 && (
        <div className="search-results">
          <h2>Search Results</h2>
          <div className="company-list">
            {searchResults.map(company => renderCompanyCard(company))}
          </div>
        </div>
      )}
      
      {/* Show user's companies if not searching or no results */}
      {(!searchResults.length || !searchQuery) && (
        <>
          <h2>Your Companies</h2>
          {companies.length === 0 ? (
            <p>You don't have any companies yet.</p>
          ) : (
            <div className="company-list">
              {companies.map(company => renderCompanyCard(company))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompanyList; 
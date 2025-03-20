import React, { useState, useEffect, useCallback } from 'react';
import { useData } from '../contexts/DataContext';
import './Search.css';

// Define interfaces for our data types
interface DataType {
  id: string;
  name: string;
  description: string | null;
  category: string;
}

// Update Company interface to match the schema
interface Company {
  id: string;
  name: string;
  ownerId: string;
  description?: string | null;
  website?: string | null;
  industry?: string | null;
  sizeRange?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  address?: string | null;
  postalCode?: string | null;
  phone?: string | null;
  isActive?: boolean | null;
}

interface SearchResult {
  id: string;
  type: string;
  name: string;
  description: string;
  link: string;
}

const RESULTS_LIMIT = 10; // Limit results for better performance

const Search: React.FC = () => {
  const { client } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search term to prevent excessive API calls
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Perform search when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch();
    }
  }, [debouncedSearchTerm]);

  const handleSearch = useCallback(async () => {
    if (!debouncedSearchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    try {
      // Search in data types with limit
      const dataTypeResults = await client.models.DataType.list({
        filter: {
          or: [
            { name: { contains: debouncedSearchTerm } },
            { description: { contains: debouncedSearchTerm } },
            { category: { contains: debouncedSearchTerm } }
          ]
        },
        limit: RESULTS_LIMIT
      });
      
      // Search in companies with limit
      const companyResults = await client.models.Company.list({
        filter: {
          or: [
            { name: { contains: debouncedSearchTerm } },
            { description: { contains: debouncedSearchTerm } },
            { industry: { contains: debouncedSearchTerm } }
          ]
        },
        limit: RESULTS_LIMIT
      });
      
      // Combine and format results
      const formattedResults = [
        ...dataTypeResults.data.map((item: DataType) => ({
          id: item.id,
          type: 'Data Type',
          name: item.name,
          description: item.description || 'No description',
          link: `/data-types`
        })),
        ...companyResults.data.map((item) => ({
          id: item.id,
          type: 'Company',
          name: item.name,
          description: item.description || 'No description',
          link: `/companies`
        }))
      ];
      
      setSearchResults(formattedResults);
    } catch (err) {
      console.error('Error during search:', err);
    } finally {
      setIsSearching(false);
    }
  }, [client, debouncedSearchTerm]);

  return (
    <div className="search">
      <h2>Search</h2>
      
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for data types, companies, users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          className="search-button"
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      {searchResults.length > 0 ? (
        <div className="search-results">
          <h3>Results ({searchResults.length})</h3>
          <div className="results-list">
            {searchResults.map((result) => (
              <div key={`${result.type}-${result.id}`} className="result-card">
                <div className="result-type">{result.type}</div>
                <h4>{result.name}</h4>
                <p>{result.description}</p>
                <a href={result.link} className="result-link">View details</a>
              </div>
            ))}
          </div>
        </div>
      ) : debouncedSearchTerm && !isSearching ? (
        <div className="no-results">
          <p>No results found for "{debouncedSearchTerm}"</p>
        </div>
      ) : null}
    </div>
  );
};

export default Search; 
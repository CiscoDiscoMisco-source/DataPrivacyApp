import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import './Search.css';

// Define interfaces for our data types
interface DataType {
  id: string;
  name: string;
  description: string | null;
  category: string;
}

interface Company {
  id: string;
  name: string;
  description: string | null;
  industry: string;
}

interface SearchResult {
  id: string;
  type: string;
  name: string;
  description: string;
  link: string;
}

const Search: React.FC = () => {
  const { client } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      // Search in data types
      const dataTypeResults = await client.models.DataType.list({
        filter: {
          or: [
            { name: { contains: searchTerm } },
            { description: { contains: searchTerm } },
            { category: { contains: searchTerm } }
          ]
        }
      });
      
      // Search in companies
      const companyResults = await client.models.Company.list({
        filter: {
          or: [
            { name: { contains: searchTerm } },
            { description: { contains: searchTerm } },
            { industry: { contains: searchTerm } }
          ]
        }
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
        ...companyResults.data.map((item: Company) => ({
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
  };

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
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
      ) : searchTerm && !isSearching ? (
        <div className="no-results">
          <p>No results found for "{searchTerm}"</p>
        </div>
      ) : null}
    </div>
  );
};

export default Search; 
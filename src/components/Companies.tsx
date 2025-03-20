import React, { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext';
import './Companies.css';

interface Company {
  id: string;
  name: string;
  description: string | null;
  website?: string;
  industry?: string;
  sizeRange?: string;
  city?: string;
  state?: string;
  country?: string;
}

const Companies: React.FC = () => {
  const { client, loading, error } = useData();
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const result = await client.models.Company.list();
        setCompanies(result.data as Company[]);
      } catch (err) {
        console.error('Error fetching companies:', err);
      }
    };

    fetchCompanies();
  }, [client]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="companies">
      <h2>Companies</h2>
      <div className="companies-grid">
        {companies.map((company: Company) => (
          <div key={company.id} className="company-card">
            <h3>{company.name}</h3>
            <p className="description">{company.description || 'No description'}</p>
            <div className="company-details">
              {company.website && (
                <p>Website: <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></p>
              )}
              <p>Industry: {company.industry || 'Not specified'}</p>
              <p>Size: {company.sizeRange || 'Not specified'}</p>
              {company.city && company.country && (
                <p>Location: {company.city}, {company.state && `${company.state}, `}{company.country}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Companies; 
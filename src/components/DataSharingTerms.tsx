import React, { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext';
import './DataSharingTerms.css';

const DataSharingTerms: React.FC = () => {
  const { client, loading, error } = useData();
  const [terms, setTerms] = useState<any[]>([]);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const result = await client.models.DataSharingTerm.list();
        setTerms(result.data as any[]);
      } catch (err) {
        console.error('Error fetching data sharing terms:', err);
      }
    };

    fetchTerms();
  }, [client]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return 'status-accepted';
      case 'REJECTED': return 'status-rejected';
      case 'EXPIRED': return 'status-expired';
      case 'TERMINATED': return 'status-terminated';
      default: return 'status-pending';
    }
  };

  return (
    <div className="data-sharing-terms">
      <h2>Data Sharing Terms</h2>
      <div className="terms-grid">
        {terms.map((term) => (
          <div key={term.id} className="term-card">
            <div className="term-header">
              <h3>{term.purpose}</h3>
              <span className={`status ${getStatusClass(term.status)}`}>
                {term.status}
              </span>
            </div>
            <div className="term-details">
              <p><strong>Duration:</strong> {term.duration} days</p>
              {term.startDate && (
                <p><strong>Start Date:</strong> {new Date(term.startDate).toLocaleDateString()}</p>
              )}
              {term.endDate && (
                <p><strong>End Date:</strong> {new Date(term.endDate).toLocaleDateString()}</p>
              )}
              {term.terminationReason && (
                <p><strong>Termination Reason:</strong> {term.terminationReason}</p>
              )}
              <p><strong>Active:</strong> {term.isActive ? 'Yes' : 'No'}</p>
              {term.conditions && (
                <div className="conditions">
                  <h4>Conditions:</h4>
                  <pre>{JSON.stringify(term.conditions, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataSharingTerms; 
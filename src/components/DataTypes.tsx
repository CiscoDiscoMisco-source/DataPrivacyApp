import React, { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext';
import './DataTypes.css';

interface DataType {
  id: string;
  name: string;
  description: string | null;
  category: string;
  isSensitive: boolean;
  retentionPeriod: number | null;
  isRequired: boolean;
  validationRules: any;
  isActive: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

const DataTypes: React.FC = () => {
  const { client, loading, error } = useData();
  const [dataTypes, setDataTypes] = useState<DataType[]>([]);

  useEffect(() => {
    const fetchDataTypes = async () => {
      try {
        const result = await client.models.DataType.list();
        setDataTypes(result.data as DataType[]);
      } catch (err) {
        console.error('Error fetching data types:', err);
      }
    };

    fetchDataTypes();
  }, [client]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="data-types">
      <h2>Data Types</h2>
      <div className="data-types-grid">
        {dataTypes.map((dataType: DataType) => (
          <div key={dataType.id} className="data-type-card">
            <h3>{dataType.name}</h3>
            <p>{dataType.description || 'No description'}</p>
            <p>Category: {dataType.category}</p>
            <p>Sensitive: {dataType.isSensitive ? 'Yes' : 'No'}</p>
            {dataType.retentionPeriod && (
              <p>Retention Period: {dataType.retentionPeriod} days</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataTypes; 
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

interface DataContextType {
  client: ReturnType<typeof generateClient<Schema>>;
  loading: boolean;
  error: Error | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: React.ReactNode;
  client: ReturnType<typeof generateClient<Schema>>;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children, client }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        // Add any initialization logic here
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize data'));
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  return (
    <DataContext.Provider value={{ client, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}; 
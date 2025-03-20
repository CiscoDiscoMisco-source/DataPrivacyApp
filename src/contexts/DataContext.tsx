import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';

interface DataContextType {
  loading: boolean;
  error: Error | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Create a single client instance for the app
export const client = generateClient();

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
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
    <DataContext.Provider value={{ loading, error }}>
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
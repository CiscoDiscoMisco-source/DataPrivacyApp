import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../amplify/data/resource';

// Create a single client instance for the app
export const client = generateClient<Schema>();

interface DataContextType {
  client: ReturnType<typeof generateClient<Schema>>;
  loading: boolean;
  error: Error | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        // Add any initialization logic here
      } catch (err) {
        if (isMountedRef.current) {
          setError(err instanceof Error ? err : new Error('Failed to initialize data'));
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    initializeData();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMountedRef.current = false;
    };
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
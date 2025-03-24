import React, { createContext, useContext, useState } from 'react';
import { storageService, TransferProgressEvent } from '../services/storage';

interface StorageContextType {
  loading: boolean;
  error: Error | null;
  progressData: { [key: string]: number } | null;
  upload: (key: string, file: File, onProgress?: (event: TransferProgressEvent) => void) => Promise<any>;
  download: (key: string, onProgress?: (event: TransferProgressEvent) => void) => Promise<any>;
  remove: (key: string) => Promise<any>;
  getUrl: (key: string) => Promise<any>;
  list: (prefix?: string) => Promise<any>;
  clearError: () => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

interface StorageProviderProps {
  children: React.ReactNode;
}

export const StorageProvider: React.FC<StorageProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progressData, setProgressData] = useState<{ [key: string]: number } | null>(null);

  const handleProgress = (key: string) => (event: TransferProgressEvent) => {
    if (event.transferredBytes !== undefined && event.totalBytes !== undefined) {
      const progress = Math.round((event.transferredBytes / event.totalBytes) * 100);
      setProgressData((prev) => ({ ...prev, [key]: progress }));
    }
  };

  const upload = async (
    key: string, 
    file: File, 
    onProgress?: (event: TransferProgressEvent) => void
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await storageService.uploadFile(key, file, {
        progressCallback: onProgress || handleProgress(key)
      });
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Upload failed'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const download = async (
    key: string, 
    onProgress?: (event: TransferProgressEvent) => void
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await storageService.downloadFile(key);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Download failed'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (key: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await storageService.removeFile(key);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Remove failed'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUrl = async (key: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await storageService.getFileUrl(key);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Get URL failed'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const list = async (prefix = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await storageService.listFiles(prefix);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('List failed'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <StorageContext.Provider
      value={{
        loading,
        error,
        progressData,
        upload,
        download,
        remove,
        getUrl,
        list,
        clearError,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
}; 
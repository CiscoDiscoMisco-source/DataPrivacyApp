import { useState, useEffect, useCallback } from 'react';
import ApiService from '../services/api';

interface ConnectionStatus {
  isOnline: boolean;
  lastChecked: Date | null;
  checking: boolean;
}

/**
 * Hook to monitor the connection status to the API
 * @param checkInterval - How often to check connection in milliseconds (default: 60000ms / 1min)
 * @returns Connection status object
 */
export function useConnectionStatus(checkInterval = 60000): ConnectionStatus & { checkNow: () => Promise<boolean> } {
  const [status, setStatus] = useState<ConnectionStatus>({
    isOnline: true, // Optimistically assume online
    lastChecked: null,
    checking: false
  });

  const checkConnection = useCallback(async () => {
    if (status.checking) return status.isOnline;
    
    setStatus(prev => ({ ...prev, checking: true }));
    
    try {
      const isOnline = await ApiService.checkHealth();
      
      setStatus({
        isOnline,
        lastChecked: new Date(),
        checking: false
      });
      
      return isOnline;
    } catch (error) {
      console.error('Error checking connection:', error);
      
      setStatus({
        isOnline: false,
        lastChecked: new Date(),
        checking: false
      });
      
      return false;
    }
  }, [status.checking]);

  // Check connection immediately on mount
  useEffect(() => {
    checkConnection();
    
    // Listen for navigator online/offline events
    const handleOnline = () => {
      // When the browser detects we're online, verify API connection
      checkConnection();
    };
    
    const handleOffline = () => {
      setStatus({
        isOnline: false,
        lastChecked: new Date(),
        checking: false
      });
    };
    
    // Listen for custom API connection events
    const handleApiConnectionChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ online: boolean }>;
      setStatus(prev => ({
        ...prev,
        isOnline: customEvent.detail.online,
        lastChecked: new Date()
      }));
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('api:connectionchange', handleApiConnectionChange);
    
    // Set up periodic checking
    const intervalId = setInterval(() => {
      checkConnection();
    }, checkInterval);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('api:connectionchange', handleApiConnectionChange);
      clearInterval(intervalId);
    };
  }, [checkConnection, checkInterval]);

  return {
    ...status,
    checkNow: checkConnection
  };
}

export default useConnectionStatus; 
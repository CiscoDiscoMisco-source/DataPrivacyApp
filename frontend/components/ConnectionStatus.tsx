import React from 'react';
import useConnectionStatus from '../hooks/useConnectionStatus';

interface ConnectionStatusProps {
  showLastChecked?: boolean;
}

/**
 * Component to display the current connection status to the API
 */
const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ showLastChecked = false }) => {
  const { isOnline, lastChecked, checking, checkNow } = useConnectionStatus();
  
  // Format the last checked time
  const formattedLastChecked = lastChecked 
    ? lastChecked.toLocaleTimeString()
    : 'never';
  
  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className="flex items-center">
        {/* Status indicator */}
        <div className={`h-2 w-2 rounded-full mr-2 ${
          checking 
            ? 'bg-yellow-400 animate-pulse' 
            : isOnline 
              ? 'bg-green-500' 
              : 'bg-red-500'
        }`} />
        
        {/* Status text */}
        <span className={isOnline ? 'text-green-500' : 'text-red-500'}>
          {checking 
            ? 'Checking connection...' 
            : isOnline 
              ? 'Connected' 
              : 'Disconnected'
          }
        </span>
      </div>
      
      {/* Last checked timestamp */}
      {showLastChecked && lastChecked && (
        <span className="text-gray-400 text-xs">
          Last checked: {formattedLastChecked}
        </span>
      )}
      
      {/* Retry button - only shown when offline */}
      {!isOnline && !checking && (
        <button 
          onClick={() => checkNow()} 
          className="text-primary-light hover:text-primary-dark text-xs underline"
          aria-label="Retry connection"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ConnectionStatus; 
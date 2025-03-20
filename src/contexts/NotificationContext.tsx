import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import './Notification.css';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (message: string, type: NotificationType, duration?: number) => void;
  hideNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timeoutIdsRef = useRef<Record<string, NodeJS.Timeout>>({});

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    
    // Clear the timeout when hiding notification
    if (timeoutIdsRef.current[id]) {
      clearTimeout(timeoutIdsRef.current[id]);
      delete timeoutIdsRef.current[id];
    }
  }, []);

  const showNotification = useCallback((message: string, type: NotificationType, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    setNotifications((prev) => [...prev, { id, message, type, duration }]);
    
    if (duration > 0) {
      // Store the timeout ID
      const timeoutId = setTimeout(() => {
        hideNotification(id);
      }, duration);
      
      timeoutIdsRef.current[id] = timeoutId;
    }
    
    return id;
  }, [hideNotification]);

  useEffect(() => {
    // Clean up any remaining notifications and timeouts when the component unmounts
    return () => {
      Object.values(timeoutIdsRef.current).forEach(clearTimeout);
      timeoutIdsRef.current = {};
      setNotifications([]);
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, hideNotification }}>
      {children}
      
      <div className="notification-container">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`notification notification-${notification.type}`}
          >
            <div className="notification-message">{notification.message}</div>
            <button 
              className="notification-close"
              onClick={() => hideNotification(notification.id)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}; 
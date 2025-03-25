import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/auth';

// Create the authentication context
const AuthContext = createContext(null);

// Authentication Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ id: 1, name: 'Default User', isAdmin: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize auth state on component mount
  useEffect(() => {
    setLoading(false);
  }, []);

  // Log out the current user
  const logout = () => {
    // Just for UI functionality, doesn't actually logout
    console.log('Logout clicked');
  };

  // Value to be provided by the context
  const value = {
    user,
    loading,
    error,
    logout,
    isAuthenticated: true // Always authenticated since login is removed
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 
import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/auth';

// Create the authentication context
const AuthContext = createContext(null);

// Authentication Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on component mount
  useEffect(() => {
    const initAuth = () => {
      try {
        // Check if user is already logged in
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.register(userData);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Log in an existing user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.login(credentials);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Log out the current user
  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  // Value to be provided by the context
  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user
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
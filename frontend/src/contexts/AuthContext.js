import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from local storage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
      api.setAuthToken(token);
    }

    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/api/login', { email, password });
      const { user, access_token } = response.data.data;
      
      // Save auth data
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      setCurrentUser(user);
      setIsAuthenticated(true);
      api.setAuthToken(access_token);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  // Register function
  const register = async (username, email, name, lastName, birthDate, nationalId, password) => {
    try {
      const response = await api.post('/api/register', { 
        username, 
        email, 
        name, 
        lastName, 
        birthDate, 
        nationalId, 
        password 
      });
      const { user, access_token } = response.data.data;
      
      // Save auth data
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      setCurrentUser(user);
      setIsAuthenticated(true);
      api.setAuthToken(access_token);
      
      return { success: true };
    } catch (error) {
      const errors = error.response?.data?.data?.errors || {};
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message, errors };
    }
  };

  // Logout function
  const logout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update state
    setCurrentUser(null);
    setIsAuthenticated(false);
    api.clearAuthToken();
    
    // Redirect to login
    navigate('/login');
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 
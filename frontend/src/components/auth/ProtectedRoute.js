import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-24">Loading...</div>;
  }
  
  return children;
};

export default ProtectedRoute; 
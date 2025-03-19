import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // In a real app, you would use Amplify Auth to check if the user is authenticated
  // const { isSignedIn } = getCurrentUser();
  
  // For development, we'll just mock the authentication state
  const isAuthenticated = true; // Change to false to test redirection

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute; 
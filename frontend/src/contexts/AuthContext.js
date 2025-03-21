import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, signIn, signOut, fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from Amplify
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Check if user is signed in
        const user = await getCurrentUser();
        if (user) {
          const attributes = await fetchUserAttributes();
          setCurrentUser(attributes);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth state check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const result = await signIn({
        username: email,
        password
      });
      
      if (result) {
        const attributes = await fetchUserAttributes();
        setCurrentUser(attributes);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed' 
      };
    }
  };

  // Register function
  const register = async (username, email, name, lastName, birthDate, nationalId, password) => {
    try {
      console.log('Attempting Amplify registration with:', { email, name, lastName, birthDate, nationalId });
      
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            given_name: name,
            family_name: lastName,
            birthdate: birthDate
          }
        }
      });
      
      console.log('Amplify registration result:', result);
      
      if (result.isSignUpComplete) {
        // Auto sign-in after registration if no verification is required
        // Otherwise, redirect to confirmation page
        if (!result.nextStep.signUpStep) {
          await login(email, password);
        }
        
        return { success: true, data: result };
      } else {
        return { 
          success: true, 
          data: result,
          requiresConfirmation: true 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message || 'Registration failed',
        errors: {} 
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut();
      // Update state
      setCurrentUser(null);
      setIsAuthenticated(false);
      
      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
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
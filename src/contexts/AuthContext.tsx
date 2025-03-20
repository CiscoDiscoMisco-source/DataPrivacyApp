"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { signUp, signIn, signOut, getCurrentUser, type SignUpOutput } from 'aws-amplify/auth';
import { signInWithRedirect } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { UserApi } from '../services/ApiService';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string, birthdate?: string, nationalId?: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        // Get the current authenticated user
        const { userId, username, signInDetails } = await getCurrentUser();
        
        // Get additional user attributes if needed
        // This would need to be expanded based on your auth setup
        if (username) {
          setUser({
            id: userId,
            email: username, // In Cognito, username is often the email
            firstName: '', // These would need to be retrieved from user attributes
            lastName: '',
            isAdmin: false
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setUser(null);
        setError(err instanceof Error ? err : new Error('Failed to authenticate'));
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    
    // Set up Hub listener for auth events
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signInWithRedirect':
          // User has been redirected back after successful sign-in
          checkAuth();
          break;
        case 'signInWithRedirect_failure':
          // OAuth sign-in failed
          setError(new Error('Google sign-in failed'));
          setLoading(false);
          break;
        case 'signedOut':
          setUser(null);
          break;
      }
    });
    
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Sign in the user with Amplify Auth
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password,
      });
      
      if (isSignedIn) {
        // Get user info after successful sign-in
        const { userId, username } = await getCurrentUser();
        
        try {
          // Fetch user data from database
          const userData = await UserApi.get(userId);
          
          if (userData) {
            setUser({
              id: userId,
              email: username || email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              isAdmin: userData.isAdmin || false
            });
          } else {
            // If user not found in database but exists in Cognito
            setUser({
              id: userId,
              email: username || email,
              firstName: '',
              lastName: '',
              isAdmin: false
            });
            
            console.warn('User authenticated but not found in database');
          }
        } catch (dbError) {
          console.error('Error fetching user data from database:', dbError);
          
          // Fall back to basic user info
          setUser({
            id: userId,
            email: username || email,
            firstName: '',
            lastName: '',
            isAdmin: false
          });
        }
      } else {
        // Handle authentication challenges if necessary
        console.log('Next auth step required:', nextStep);
        throw new Error(`Authentication requires: ${nextStep.signInStep}`);
      }
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string, birthdate?: string, nationalId?: string) => {
    try {
      setLoading(true);
      
      // Prepare user attributes
      const userAttributes: Record<string, string> = {
        email,
        given_name: firstName,
        family_name: lastName
      };
      
      // Add optional attributes if provided
      if (birthdate) {
        userAttributes.birthdate = birthdate;
      }
      
      // Remove the custom:nationalId attribute from Cognito
      // We'll still store it in our database below
      
      // Register user with Amplify Auth
      const { isSignUpComplete, userId, nextStep }: SignUpOutput = await signUp({
        username: email,
        password,
        options: {
          userAttributes
        }
      });
      
      if (!isSignUpComplete) {
        // Handle any additional signup steps (e.g., confirmation)
        console.log('Sign up requires more steps:', nextStep);
      }
      
      // Create user in our database
      try {
        await UserApi.create({
          id: userId, // Use the Cognito user ID
          email,
          firstName,
          lastName,
          birthdate,
          nationalId, // Still store nationalId in our database
          isActive: true,
          isAdmin: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        console.log('User created in database');
      } catch (dbError) {
        console.error('Error creating user in database:', dbError);
        // Note: We continue even if database creation fails, as the user is registered in Cognito
      }
      
      console.log('Registered user with ID:', userId);
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // Sign out using Amplify Auth
      await signOut();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithRedirect({ provider: 'Google' });
      // The page will redirect to Google at this point
    } catch (err) {
      console.error('Google login error:', err);
      setLoading(false);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      register, 
      logout,
      loginWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
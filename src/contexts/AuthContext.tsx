"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { signUp, signIn, signOut, getCurrentUser, type SignUpOutput, fetchUserAttributes } from 'aws-amplify/auth';
import { signInWithRedirect } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { client } from '../amplify-config';

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

  // Helper function to fetch user attributes and set the user state
  const fetchAndSetUserData = async () => {
    try {
      const { userId, username } = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      
      setUser({
        id: userId,
        email: username || attributes.email || '',
        firstName: attributes.given_name || '',
        lastName: attributes.family_name || '',
        // Admin status could be managed through Cognito groups instead
        isAdmin: false 
      });
    } catch (err) {
      console.error('Error fetching user attributes:', err);
      setUser(null);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        // Get the current authenticated user
        const { userId, username } = await getCurrentUser();
        
        if (username) {
          // Fetch user attributes from Cognito
          await fetchAndSetUserData();
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
          fetchAndSetUserData();
          setLoading(false);
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
        // Get user attributes from Cognito
        await fetchAndSetUserData();
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
      
      // Prepare user attributes for Cognito
      const userAttributes: Record<string, string> = {
        email,
        given_name: firstName,
        family_name: lastName
      };
      
      // Add optional attributes if provided
      if (birthdate) {
        userAttributes.birthdate = birthdate;
      }
      
      // Only add nationalId if it's provided - it will be stored as custom:nationalid in Cognito
      if (nationalId) {
        userAttributes['custom:nationalid'] = nationalId;
      }
      
      // Register user with Amplify Auth (Cognito)
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
      
      console.log('Registered user with ID:', userId);
      
      // After successful signup, we'll create a user entry in our GraphQL API
      // This is needed to store any additional data that doesn't fit in Cognito
      if (userId && isSignUpComplete) {
        try {
          // Create user in the data API
          await client.models.User.create({
            email,
            firstName,
            lastName,
            birthdate,
            nationalId,
            isActive: true,
            isAdmin: false,
            createdAt: new Date().toISOString()
          });
        } catch (apiError) {
          console.error('Error creating user in database:', apiError);
          // We won't throw here since the auth signup was successful
        }
      }
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
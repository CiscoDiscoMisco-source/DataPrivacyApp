import React, { createContext, useContext, useState, useEffect } from 'react';
import { signUp, signIn, signOut, getCurrentUser, type SignUpOutput } from 'aws-amplify/auth';

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
        
        setUser({
          id: userId,
          email: username || email,
          firstName: '',
          lastName: '',
          isAdmin: false // You would determine this based on user groups or attributes
        });
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
      
      if (nationalId) {
        userAttributes['custom:nationalId'] = nationalId;
      }
      
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

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
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
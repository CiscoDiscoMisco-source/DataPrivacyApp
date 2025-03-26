import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ApiService from '../services/api';
import supabase from '../services/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Only run auth related code on the client side
  useEffect(() => {
    setIsMounted(true);
    
    // Skip auth checks during SSR
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }
    
    // Check for existing session and validate on initial load
    const checkAuth = async () => {
      try {
        // Get session from Supabase
        const sessionResponse = await supabase.auth.getSession();
        const session = sessionResponse?.data?.session;
        
        if (session) {
          // Get user details from our API
          const userData = await ApiService.get<User>('/auth/me');
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        try {
          await supabase.auth.signOut();
        } catch (signOutError) {
          console.error('Error signing out:', signOutError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      const authListener = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            // Store the access token in localStorage for API requests
            localStorage.setItem('dp_access_token', session.access_token);
            // Store user ID for later use
            if (session.user) {
              localStorage.setItem('dp_user_id', session.user.id);
            }
            
            try {
              const userData = await ApiService.get<User>('/auth/me');
              setUser(userData);
            } catch (error) {
              console.error('Failed to get user data after sign in:', error);
            }
          } else if (event === 'SIGNED_OUT') {
            // Clear tokens on sign out
            localStorage.removeItem('dp_access_token');
            localStorage.removeItem('dp_user_id');
            setUser(null);
          }
        }
      );
      
      subscription = authListener?.data?.subscription;
    } catch (error) {
      console.error('Error setting up auth listener:', error);
    }

    checkAuth();

    // Clean up subscription on unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Check connection to Supabase/API first
      const isConnected = await ApiService.checkHealth();
      if (!isConnected) {
        throw new Error('No network connection available. Please check your internet connection and try again.');
      }
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user && data.session) {
        // Store the access token in localStorage for API requests
        localStorage.setItem('dp_access_token', data.session.access_token);
        // Store user ID for later use
        localStorage.setItem('dp_user_id', data.user.id);
        // Store refresh token
        localStorage.setItem('dp_refresh_token', data.session.refresh_token);
        
        try {
          // Get user profile data from our API
          const userData = await ApiService.get<User>('/auth/me');
          setUser(userData);
          
          // Use router for navigation within client-side for better UX
          router.push('/companies');
        } catch (apiError) {
          console.error('Error fetching user data:', apiError);
          // Still consider login successful but with limited functionality
          router.push('/companies');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, userData: Partial<User>) => {
    setIsLoading(true);
    try {
      // Check connection first
      const isConnected = await ApiService.checkHealth();
      if (!isConnected) {
        throw new Error('No network connection available. Please check your internet connection and try again.');
      }
      
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.name,
            // Use optional fields safely
            ...(userData as any), // Cast to any to avoid TypeScript errors with dynamic properties
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Store the session info if available
        if (data.session) {
          localStorage.setItem('dp_access_token', data.session.access_token);
          localStorage.setItem('dp_refresh_token', data.session.refresh_token);
          localStorage.setItem('dp_user_id', data.user.id);
        }
        
        // Create user profile in our API
        await ApiService.post('/auth/register', {
          ...userData,
          email: email,
          id: data.user.id,
        });
        
        // Set user data if we have a session
        if (data.session) {
          try {
            const userResponse = await ApiService.get<User>('/auth/me');
            setUser(userResponse);
            // Navigate to main page
            router.push('/companies');
          } catch (err) {
            // If can't get user data, still redirect
            router.push('/companies');
          }
        } else {
          // Some Supabase configurations require email verification
          // Redirect to login with a message
          router.push('/login?registered=true');
        }
      }
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      // Clear tokens
      localStorage.removeItem('dp_access_token');
      localStorage.removeItem('dp_user_id');
      setUser(null);
      // Use full page navigation to avoid hydration issues
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Default auth context value for server-side rendering
  const defaultContextValue: AuthContextType = {
    user: null,
    isLoading: !isMounted,
    isAuthenticated: false,
    login: async () => { throw new Error('Not initialized'); },
    signup: async () => { throw new Error('Not initialized'); },
    logout: async () => { throw new Error('Not initialized'); }
  };

  // If we're server-side, provide default values that will be overridden on client
  if (!isMounted) {
    return (
      <AuthContext.Provider value={defaultContextValue}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ApiService from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing token and validate on initial load
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('dp_access_token');
        if (token) {
          const userData = await ApiService.get<User>('/auth/me');
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('dp_access_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await ApiService.post<{ token: string; user: User }>('/auth/login', { email, password });
      localStorage.setItem('dp_access_token', response.token);
      setUser(response.user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await ApiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('dp_access_token');
      setUser(null);
      setIsLoading(false);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
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
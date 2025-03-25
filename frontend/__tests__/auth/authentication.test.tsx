import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import LoginPage from '../../pages/login';
import SignupPage from '../../pages/signup';
import supabase from '../../services/supabase';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock Supabase client
jest.mock('../../services/supabase', () => ({
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
    onAuthStateChange: jest.fn().mockReturnValue({ 
      data: { subscription: { unsubscribe: jest.fn() } } 
    }),
  },
}));

// Mock API service
jest.mock('../../services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('Authentication Flow', () => {
  const mockRouter = {
    push: jest.fn(),
    query: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test('User can sign up with valid credentials', async () => {
    // Mock successful signup
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: {
        user: { id: 'test-user-id', email: 'test@example.com' },
        session: { access_token: 'test-token' },
      },
      error: null,
    });

    await act(async () => {
      render(
        <AuthProvider>
          <SignupPage />
        </AuthProvider>
      );
    });

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Create account/i }));
    });

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'Test User',
          },
        },
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/login?registered=true');
    });
  });

  test('User can login with valid credentials', async () => {
    // Mock successful login
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: {
        user: { id: 'test-user-id', email: 'test@example.com' },
        session: { access_token: 'test-token' },
      },
      error: null,
    });

    // Mock successful user data fetch
    const mockApiGet = require('../../services/api').get;
    mockApiGet.mockResolvedValue({
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      isAdmin: false,
    });

    await act(async () => {
      render(
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      );
    });

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
    });

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('Shows error message on login failure', async () => {
    // Mock failed login
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' },
    });

    await act(async () => {
      render(
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      );
    });

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/Invalid login credentials/i)).toBeInTheDocument();
    });
  });

  test('Shows error on password mismatch during signup', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <SignupPage />
        </AuthProvider>
      );
    });

    // Fill out the form with mismatched passwords
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'differentpassword' } });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Create account/i }));
    });

    // Should show error without calling signUp
    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });
}); 
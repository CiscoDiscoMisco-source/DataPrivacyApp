import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Check if user just registered
    if (router.query.registered === 'true') {
      setSuccessMessage('Account created successfully! You can now log in.');
    }
    
    // Check for auth errors
    if (router.query.error) {
      setError(router.query.error as string);
    }
  }, [router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      // Redirect handled in login function
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle specific error types with user-friendly messages
      if (err.message?.includes('network connection')) {
        setError('Cannot connect to the server. Please check your internet connection and try again.');
      } else if (err.message?.includes('Invalid login credentials')) {
        setError('Incorrect email or password. Please try again.');
      } else {
        setError(err.message || 'Failed to login. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Sign In">
      <div className="min-h-[80vh] flex flex-col justify-center items-center">
        <div className="glass-premium max-w-md w-full mx-auto p-8">
          <div className="text-center mb-6">
            <h1 className="glass-heading text-3xl mb-2">Sign In</h1>
            <p className="glass-text text-sm">
              Or{' '}
              <Link href="/signup" className="text-accent-300 hover:text-accent-200 transition-colors">
                create a new account
              </Link>
            </p>
          </div>
          
          {successMessage && (
            <div className="glass-container bg-green-500/20 border-green-500/30 mb-6 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-100">Success</h3>
                  <div className="mt-2 text-sm text-green-100">{successMessage}</div>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="glass-container bg-red-500/20 border-red-500/30 mb-6 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-100">Error</h3>
                  <div className="mt-2 text-sm text-red-100">{error}</div>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="glass-text text-sm font-medium block mb-2">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="glass-input w-full"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="glass-text text-sm font-medium block mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="glass-input w-full"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="glass-button w-full flex justify-center bg-accent-500/50 hover:bg-accent-500/70"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage; 
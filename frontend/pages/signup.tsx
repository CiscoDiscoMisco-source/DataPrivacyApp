import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      // Build user data with fields beyond just email/password
      const userData = {
        name: `${name}`.trim(),
        first_name: name.split(' ')[0],
        last_name: name.split(' ')[1],
        // Add any other user profile data here
      };
      
      await signup(email, password, userData);
      // Redirect is handled in the signup function
    } catch (err: any) {
      console.error('Signup error:', err);
      
      // Handle specific error types with user-friendly messages
      if (err.message?.includes('network connection')) {
        setError('Cannot connect to the server. Please check your internet connection and try again.');
      } else if (err.message?.includes('email') && err.message?.includes('already')) {
        setError('This email is already registered. Please use a different email or sign in.');
      } else if (err.message?.includes('weak password')) {
        setError('Please use a stronger password with at least 8 characters, including numbers and special characters.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Create Account">
      <div className="min-h-[80vh] flex flex-col justify-center items-center">
        <div className="glass-premium max-w-md w-full mx-auto p-8">
          <div className="text-center mb-6">
            <h1 className="glass-heading text-3xl mb-2">Create Account</h1>
            <p className="glass-text text-sm">
              Or{' '}
              <Link href="/login" className="text-accent-300 hover:text-accent-200 transition-colors">
                sign in to your existing account
              </Link>
            </p>
          </div>
          
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
                <label htmlFor="name" className="glass-text text-sm font-medium block mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="glass-input w-full"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
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
                  autoComplete="new-password"
                  required
                  className="glass-input w-full"
                  placeholder="Create password (min. 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="glass-text text-sm font-medium block mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="glass-input w-full"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="glass-button w-full flex justify-center bg-accent-500/50 hover:bg-accent-500/70"
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage; 
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setBackendError(false);
    
    // Simple validation
    if (!email.trim() || !password.trim()) {
      setFormError('Email and password are required');
      return;
    }
    
    // Attempt login
    setLoading(true);
    try {
      await login({ email, password });
      
      // Navigate to home page on successful login
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      
      // Check if the error is related to backend connectivity
      if (error.message && (
        error.message.includes('server is not responding') || 
        error.message.includes('504') || 
        error.message.includes('backend')
      )) {
        setBackendError(true);
        setFormError(error.message);
      } else {
        setFormError(error.message || 'Failed to log in. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-page">
      <div className="card">
        <div className="card-header">
          <h2>Login</h2>
        </div>
        <div className="card-body">
          {formError && (
            <div className={`alert ${backendError ? 'alert-warning' : 'alert-danger'}`} role="alert">
              {formError}
              {backendError && (
                <div className="mt-2">
                  <strong>Troubleshooting:</strong>
                  <ul className="mb-0">
                    <li>Make sure the backend server is running</li>
                    <li>Check if the app is connecting to the correct backend URL</li>
                    <li>Verify your network connection</li>
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="d-grid">
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
        <div className="card-footer text-center">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 
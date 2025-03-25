import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: ''
  });
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validateForm = () => {
    // Check for empty fields
    for (const key in formData) {
      if (formData[key].trim() === '') {
        setFormError(`${key.replace('_', ' ')} is required`);
        return false;
      }
    }
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    
    // Password length validation
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setBackendError(false);
    
    if (!validateForm()) {
      return;
    }
    
    // Prepare data for registration (remove confirmPassword)
    const { confirmPassword, ...registrationData } = formData;
    
    // Attempt registration
    setLoading(true);
    try {
      await register(registrationData);
      
      // Navigate to home page on successful registration
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      
      // Check if the error is related to backend connectivity
      if (error.message && (
        error.message.includes('server is not responding') || 
        error.message.includes('504') || 
        error.message.includes('backend')
      )) {
        setBackendError(true);
        setFormError(error.message);
      } else {
        setFormError(error.message || 'Failed to register. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-page">
      <div className="card">
        <div className="card-header">
          <h2>Register</h2>
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
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="first_name" className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col">
                <label htmlFor="last_name" className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="form-text">Password must be at least 6 characters long.</div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="d-grid">
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
        <div className="card-footer text-center">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 
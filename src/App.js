import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import CompaniesPage from './pages/CompaniesPage';
import PreferencesPage from './pages/PreferencesPage';
import SettingsPage from './pages/SettingsPage';

// Protected route component - simplified since login is removed
const ProtectedRoute = ({ children }) => {
  const { loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return children;
};

const AppHeader = ({ searchTerm, handleSearch }) => {
  const location = useLocation();
  const { logout } = useAuth();
  
  return (
    <header className="header">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <h1>Data Privacy App</h1>
          <div className="search-container">
            <input 
              type="text" 
              id="global-search" 
              className="form-control" 
              placeholder="Search companies..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        <nav className="mt-3">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/' || location.pathname === '/companies' ? 'active' : ''}`} 
                to="/companies"
              >
                Companies
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/preferences' ? 'active' : ''}`} 
                to="/preferences"
              >
                My Preferences
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`} 
                to="/settings"
              >
                Settings
              </Link>
            </li>
            <li className="nav-item ms-auto">
              <button 
                className="nav-link text-danger" 
                onClick={logout}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

const AppFooter = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Data Privacy App</p>
      </div>
    </footer>
  );
};

const AppContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  return (
    <div className="app-container">
      <AppHeader searchTerm={searchTerm} handleSearch={handleSearch} />
      
      <main className="container my-4">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <CompaniesPage searchTerm={searchTerm} />
            </ProtectedRoute>
          } />
          
          <Route path="/companies" element={
            <ProtectedRoute>
              <CompaniesPage searchTerm={searchTerm} />
            </ProtectedRoute>
          } />
          
          <Route path="/preferences" element={
            <ProtectedRoute>
              <PreferencesPage />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      
      <AppFooter />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App; 
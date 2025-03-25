import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
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
    return <div className="flex justify-center items-center h-24">Loading...</div>;
  }
  
  return children;
};

const AppHeader = ({ searchTerm, handleSearch }) => {
  const location = useLocation();
  const { logout } = useAuth();
  
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Data Privacy App</h1>
          <div className="w-full md:w-64">
            <input 
              type="text" 
              id="global-search" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search companies..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        <nav className="mt-6">
          <ul className="flex border-b border-gray-200">
            <li className="mr-1">
              <Link 
                className={`inline-block px-4 py-2 rounded-t-md ${
                  location.pathname === '/' || location.pathname === '/companies' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-blue-500 hover:bg-gray-100'
                }`} 
                to="/companies"
              >
                Companies
              </Link>
            </li>
            <li className="mr-1">
              <Link 
                className={`inline-block px-4 py-2 rounded-t-md ${
                  location.pathname === '/preferences' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-blue-500 hover:bg-gray-100'
                }`} 
                to="/preferences"
              >
                My Preferences
              </Link>
            </li>
            <li className="mr-1">
              <Link 
                className={`inline-block px-4 py-2 rounded-t-md ${
                  location.pathname === '/settings' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-blue-500 hover:bg-gray-100'
                }`} 
                to="/settings"
              >
                Settings
              </Link>
            </li>
            <li className="ml-auto">
              <button 
                className="inline-block px-4 py-2 text-red-500 hover:bg-gray-100 rounded-t-md"
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
    <footer className="bg-gray-100 py-4 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600">&copy; {new Date().getFullYear()} Data Privacy App</p>
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
    <div className="flex flex-col min-h-screen">
      <AppHeader searchTerm={searchTerm} handleSearch={handleSearch} />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
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
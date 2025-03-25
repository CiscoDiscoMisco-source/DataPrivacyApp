import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import CompaniesPage from './pages/CompaniesPage';
import PreferencesPage from './pages/PreferencesPage';
import SettingsPage from './pages/SettingsPage';

const AppContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header searchTerm={searchTerm} handleSearch={handleSearch} />
      
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
      
      <Footer />
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
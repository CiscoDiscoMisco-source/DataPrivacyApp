import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CompanyList from './pages/CompanyList';
import CompanyDetail from './pages/CompanyDetail';
import PreferenceManager from './pages/PreferenceManager';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import DebugInfo from './components/DebugInfo';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app">
      {isAuthenticated && <Navbar />}
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/companies" 
            element={
              <PrivateRoute>
                <CompanyList />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/companies/:companyId" 
            element={
              <PrivateRoute>
                <CompanyDetail />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/preferences" 
            element={
              <PrivateRoute>
                <PreferenceManager />
              </PrivateRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {process.env.NODE_ENV !== 'production' && <DebugInfo />}
    </div>
  );
}

export default App; 
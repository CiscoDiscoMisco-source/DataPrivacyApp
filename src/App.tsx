import React, { memo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import DataTypes from './components/DataTypes';
import Companies from './components/Companies';
import Users from './components/Users';
import DataSharingTerms from './components/DataSharingTerms';
import UserPreferences from './components/UserPreferences';
import Search from './components/Search';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { StorageProvider } from './contexts/StorageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingProvider } from './contexts/LoadingContext';
import './amplify-config';  // Import configuration

// Combine providers to reduce nesting depth
const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary>
    <AuthProvider>
      <DataProvider>
        <StorageProvider>
          <ThemeProvider>
            <NotificationProvider>
              <LoadingProvider>
                {children}
              </LoadingProvider>
            </NotificationProvider>
          </ThemeProvider>
        </StorageProvider>
      </DataProvider>
    </AuthProvider>
  </ErrorBoundary>
);

// Memoize routes to prevent unnecessary re-renders
const AppRoutes = memo(() => (
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
      path="/data-types"
      element={
        <PrivateRoute>
          <DataTypes />
        </PrivateRoute>
      }
    />
    <Route
      path="/companies"
      element={
        <PrivateRoute>
          <Companies />
        </PrivateRoute>
      }
    />
    <Route
      path="/users"
      element={
        <PrivateRoute>
          <Users />
        </PrivateRoute>
      }
    />
    <Route
      path="/data-sharing-terms"
      element={
        <PrivateRoute>
          <DataSharingTerms />
        </PrivateRoute>
      }
    />
    <Route
      path="/user-preferences"
      element={
        <PrivateRoute>
          <UserPreferences />
        </PrivateRoute>
      }
    />
    <Route
      path="/search"
      element={
        <PrivateRoute>
          <Search />
        </PrivateRoute>
      }
    />
  </Routes>
));

function App() {
  return (
    <AppProviders>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <AppRoutes />
          </main>
        </div>
      </Router>
    </AppProviders>
  );
}

export default App; 
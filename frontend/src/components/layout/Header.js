import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ searchTerm, handleSearch }) => {
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

export default Header; 
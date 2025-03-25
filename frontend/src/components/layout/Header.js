import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ searchTerm, handleSearch }) => {
  const router = useRouter();
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
              <Link href="/companies">
                <a className={`inline-block px-4 py-2 rounded-t-md ${
                  router.pathname === '/' || router.pathname === '/companies' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-blue-500 hover:bg-gray-100'
                }`}>
                  Companies
                </a>
              </Link>
            </li>
            <li className="mr-1">
              <Link href="/preferences">
                <a className={`inline-block px-4 py-2 rounded-t-md ${
                  router.pathname === '/preferences' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-blue-500 hover:bg-gray-100'
                }`}>
                  My Preferences
                </a>
              </Link>
            </li>
            <li className="mr-1">
              <Link href="/settings">
                <a className={`inline-block px-4 py-2 rounded-t-md ${
                  router.pathname === '/settings' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-blue-500 hover:bg-gray-100'
                }`}>
                  Settings
                </a>
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
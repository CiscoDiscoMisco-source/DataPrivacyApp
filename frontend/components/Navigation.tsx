import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navigation: React.FC = () => {
  const router = useRouter();
  
  const isActive = (path: string): boolean => {
    return router.pathname === path;
  };
  
  return (
    <nav className="py-4 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="neu-flat-contrast p-4 border-b-4 border-primary-500">
          <div className="flex justify-between items-center">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-primary-800">Data Privacy App</span>
              </div>
              <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                <Link 
                  href="/companies"
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive('/companies') 
                      ? 'shadow-neu-pressed text-primary-900 bg-primary-200 border-b-2 border-primary-500' 
                      : 'shadow-neu-flat text-primary-700 hover:shadow-neu-concave hover:text-primary-800'
                  }`}
                >
                  Companies
                </Link>
                <Link 
                  href="/preferences"
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive('/preferences') 
                      ? 'shadow-neu-pressed text-primary-900 bg-primary-200 border-b-2 border-primary-500' 
                      : 'shadow-neu-flat text-primary-700 hover:shadow-neu-concave hover:text-primary-800'
                  }`}
                >
                  Preferences
                </Link>
                <Link 
                  href="/settings"
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive('/settings') 
                      ? 'shadow-neu-pressed text-primary-900 bg-primary-200 border-b-2 border-primary-500' 
                      : 'shadow-neu-flat text-primary-700 hover:shadow-neu-concave hover:text-primary-800'
                  }`}
                >
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sm:hidden mt-2">
        <div className="space-y-2 px-4">
          <Link 
            href="/companies"
            className={`block p-3 neu-flat text-center ${
              isActive('/companies') 
                ? 'shadow-neu-pressed text-primary-900 bg-primary-200 border-l-4 border-primary-500' 
                : 'text-primary-700 hover:shadow-neu-concave hover:text-primary-800'
            }`}
          >
            Companies
          </Link>
          <Link 
            href="/preferences"
            className={`block p-3 neu-flat text-center ${
              isActive('/preferences') 
                ? 'shadow-neu-pressed text-primary-900 bg-primary-200 border-l-4 border-primary-500' 
                : 'text-primary-700 hover:shadow-neu-concave hover:text-primary-800'
            }`}
          >
            Preferences
          </Link>
          <Link 
            href="/settings"
            className={`block p-3 neu-flat text-center ${
              isActive('/settings') 
                ? 'shadow-neu-pressed text-primary-900 bg-primary-200 border-l-4 border-primary-500' 
                : 'text-primary-700 hover:shadow-neu-concave hover:text-primary-800'
            }`}
          >
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 
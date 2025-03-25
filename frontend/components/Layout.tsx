import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'Data Privacy App' 
}) => {
  return (
    <div className="min-h-screen bg-primary-100">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Manage your data privacy settings across companies" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="neu-flat-contrast px-6 py-8">
          {children}
        </div>
      </main>
      
      <footer className="mt-12 py-6 border-t-2 border-primary-300">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-primary-800 font-medium">
            &copy; {new Date().getFullYear()} Data Privacy App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 
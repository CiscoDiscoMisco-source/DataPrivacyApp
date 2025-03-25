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
    <div className="min-h-screen bg-gradient-to-br from-primary-dark to-primary-light">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Manage your data privacy settings across companies" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="glass-container">
          {children}
        </div>
      </main>
      
      <footer className="mt-12 py-6">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="glass-text text-center text-sm font-medium">
            &copy; {new Date().getFullYear()} Data Privacy App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 
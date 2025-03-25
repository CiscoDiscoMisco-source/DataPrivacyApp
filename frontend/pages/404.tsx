import React from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import Layout from '../components/Layout';

const NotFoundPage: NextPage = () => {
  return (
    <Layout title="404 - Page Not Found | Data Privacy App">
      <div className="flex flex-col justify-center items-center py-12">
        <div className="glass-premium max-w-md w-full mx-auto p-8 text-center">
          <h1 className="glass-heading text-4xl mb-4">404</h1>
          <h2 className="glass-heading text-2xl mb-6">Page Not Found</h2>
          <p className="glass-text mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link href="/" className="glass-button inline-block bg-accent-500/50 hover:bg-accent-500/70 px-6 py-3">
            Go to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage; 
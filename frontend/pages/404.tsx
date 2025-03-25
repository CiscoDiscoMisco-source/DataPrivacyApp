import React from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import Layout from '../components/Layout';

const NotFoundPage: NextPage = () => {
  return (
    <Layout title="404 - Page Not Found | Data Privacy App">
      <div className="flex flex-col justify-center items-center py-12">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors">
            Go to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage; 
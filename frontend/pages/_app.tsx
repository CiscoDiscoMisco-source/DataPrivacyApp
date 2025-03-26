import React, { useEffect, useState } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Navigation from '../components/Navigation';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <AuthProvider>
      <Head>
        <title>Data Privacy App</title>
        <meta name="description" content="Manage your data privacy settings across various companies" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-500">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {isClient ? <Component {...pageProps} /> : null}
        </main>
      </div>
    </AuthProvider>
  );
} 
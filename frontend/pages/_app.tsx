import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  // Client-side only
  if (typeof window === 'undefined') {
    return null;
  }
  
  return (
    <AuthProvider>
      <Head>
        <title>Data Privacy App</title>
        <meta name="description" content="Manage your data privacy settings across various companies" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
} 
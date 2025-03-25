import { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import { GetServerSideProps } from 'next';

// This is a server-side rendered page with client-side Supabase initialization
export default function SupabaseExample() {
  const [message, setMessage] = useState('Loading...');
  
  useEffect(() => {
    // Create a Supabase client on the client side
    const supabase = createClient();
    
    // Check if the Supabase connection is working
    const checkConnection = async () => {
      try {
        // You can perform a simple query, for example:
        // Replace 'your_table' with an actual table you have in Supabase
        // const { data, error } = await supabase.from('your_table').select('count(*)', { count: 'exact' });
        
        // For demonstration purposes:
        setMessage('Supabase client has been initialized successfully');
      } catch (error) {
        console.error('Supabase connection error:', error);
        setMessage('Error connecting to Supabase');
      }
    };
    
    checkConnection();
    
    // Cleanup function
    return () => {
      // Any cleanup needed
    };
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Supabase Example</h1>
      <p className="mb-4">{message}</p>
      <p className="text-gray-600">
        This page demonstrates Supabase client-side integration with Next.js.
        Check the console for any issues with the connection.
      </p>
    </div>
  );
} 
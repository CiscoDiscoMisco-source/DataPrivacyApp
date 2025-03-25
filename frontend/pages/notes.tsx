import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Layout from '../components/Layout';

// Log environment variable existence for debugging
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function Notes() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [envInfo, setEnvInfo] = useState<string>('');

  useEffect(() => {
    // Debug environment variables
    const envDebug = {
      url: supabaseUrl ? 'defined' : 'undefined',
      key: supabaseKey ? 'defined' : 'undefined'
    };
    setEnvInfo(JSON.stringify(envDebug, null, 2));

    const fetchNotes = async () => {
      try {
        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Supabase credentials are not available. Check environment variables.');
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase.from('notes').select();
        
        if (error) {
          throw error;
        }
        
        setNotes(data || []);
      } catch (err: any) {
        console.error('Error fetching notes:', err);
        setError(err.message || 'Failed to fetch notes');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <Layout title="Notes">
      <div className="glass-container">
        <h1 className="glass-heading text-2xl mb-6">Notes</h1>
        
        <div className="mb-4 p-4 bg-gray-800/50 rounded-lg">
          <h2 className="text-lg mb-2">Environment Status:</h2>
          <pre className="text-sm">{envInfo}</pre>
        </div>
        
        {loading && (
          <div className="flex justify-center py-10">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-primary-200/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-primary-500 animate-spin rounded-full"></div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="glass-container bg-red-900/30 border-red-500/30 my-4" role="alert">
            <p className="glass-text text-red-100">{error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <pre className="bg-gray-800 p-4 rounded-lg overflow-auto max-h-[500px]">
            {JSON.stringify(notes, null, 2)}
          </pre>
        )}
      </div>
    </Layout>
  );
} 
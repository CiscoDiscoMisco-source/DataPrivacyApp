/**
 * Test script to verify Supabase connection
 * 
 * Run with: npm run test-supabase-connection
 */

// CommonJS imports for compatibility
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

// Load environment variables from .env.local
const envLocalPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config(); // Try default .env if .env.local doesn't exist
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables.');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file.');
  process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);
console.log('Testing connection to Supabase...');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    // Try to access public health endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });
    
    console.log('REST API status:', response.status, response.statusText);
    
    // Try to get session to check auth functionality
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    console.log('Supabase Auth Service is working properly');
    console.log('Session data:', data.session ? 'Session exists' : 'No active session');
    
    // Additional checks for database access
    // Try to access the tables (even if we don't have permission, we should get a valid response)
    const { error: tablesError } = await supabase.from('test').select('*').limit(1);
    
    if (tablesError && tablesError.code !== 'PGRST301') {
      // PGRST301 is "permission denied for table" which is expected if the schema is restricted
      console.warn('Database access warning:', tablesError.message);
    } else {
      console.log('Database access is configured correctly');
    }
    
    console.log('✅ Supabase connection test completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return false;
  }
}

testConnection()
  .then(success => {
    if (!success) {
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Unexpected error during test:', err);
    process.exit(1);
  }); 
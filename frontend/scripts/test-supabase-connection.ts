/**
 * Test script to validate Supabase connectivity
 * Run from the frontend directory with: npx ts-node scripts/test-supabase-connection.ts
 */

// Read from .env.local for testing
import * as fs from 'fs';
import * as path from 'path';

// Try to read from .env.local for testing
function loadEnv() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const envLines = envContent.split('\n');
      
      envLines.forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^"(.*)"$/, '$1'); // Remove quotes if present
          process.env[key] = value;
        }
      });
      
      console.log('Loaded environment variables from .env.local');
    } else {
      console.log('No .env.local file found, using existing environment variables');
    }
  } catch (error) {
    console.error('Error loading .env.local:', error);
  }
}

// Load environment variables if needed
loadEnv();

// Check for environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Define test function
async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log(`NEXT_PUBLIC_SUPABASE_URL: ${SUPABASE_URL ? 'Set' : 'Not set'}`);
  console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY ? 'Set' : 'Not set'}`);

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Environment variables are not set correctly');
    console.log('Please check your .env.local file and make sure it contains:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
    return;
  }

  try {
    // Test a simple fetch to Supabase health endpoint
    const healthUrl = `${SUPABASE_URL}/health`;
    console.log(`Testing connection to: ${healthUrl}`);
    
    // Use node-fetch for Node.js environments
    const nodeFetch = require('node-fetch');
    
    const response = await nodeFetch(healthUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Successfully connected to Supabase!');
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.error(`❌ Failed to connect to Supabase: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error('Error details:', text);
    }
  } catch (error) {
    console.error('❌ Connection test failed with error:');
    console.error(error);
    
    // Check for common issues
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.log('\nPossible causes:');
      console.log('1. Network connectivity issues');
      console.log('2. Supabase project is not running or accessible');
      console.log('3. CORS is blocking the request (browser-only issue)');
      console.log('4. Firewall or security software is blocking the connection');
    }
  }
}

// Run the test
testConnection(); 
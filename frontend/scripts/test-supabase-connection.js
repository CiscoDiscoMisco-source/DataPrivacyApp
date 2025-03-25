/**
 * Test script to validate Supabase connectivity
 * Run from the frontend directory with: node scripts/test-supabase-connection.js
 */

// Read from .env.local for testing
const fs = require('fs');
const path = require('path');

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
  console.log(`NEXT_PUBLIC_SUPABASE_URL: ${SUPABASE_URL ? 'Set (' + SUPABASE_URL + ')' : 'Not set'}`);
  console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY ? 'Set (masked for security)' : 'Not set'}`);

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
    
    // Use https module since node-fetch might have issues
    const https = require('https');
    
    const testHttpsRequest = () => {
      return new Promise((resolve, reject) => {
        const options = {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        };
        
        https.get(healthUrl, options, (res) => {
          let data = '';
          
          res.on('data', (chunk) => {
            data += chunk;
          });
          
          res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              try {
                resolve({ ok: true, data: JSON.parse(data) });
              } catch (err) {
                resolve({ ok: true, data: data });
              }
            } else {
              resolve({ ok: false, status: res.statusCode, statusText: res.statusMessage, data });
            }
          });
        }).on('error', (err) => {
          reject(err);
        });
      });
    };
    
    const result = await testHttpsRequest();
    
    if (result.ok) {
      console.log('✅ Successfully connected to Supabase!');
      console.log('Response:', JSON.stringify(result.data, null, 2));
    } else {
      console.error(`❌ Failed to connect to Supabase: ${result.status} ${result.statusText}`);
      console.error('Error details:', result.data);
    }
  } catch (error) {
    console.error('❌ Connection test failed with error:');
    console.error(error);
    
    // Check for common issues
    console.log('\nPossible causes:');
    console.log('1. Network connectivity issues');
    console.log('2. Supabase project is not running or accessible');
    console.log('3. Firewall or security software is blocking the connection');
    console.log('4. Supabase URL is incorrect');
    console.log('5. Certificate issues with HTTPS connection');
  }
}

// Run the test
testConnection(); 
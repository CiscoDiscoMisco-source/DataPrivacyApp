/**
 * Test script to validate API health and connectivity
 * Run from the frontend directory with: node scripts/test-api.js
 */

// Read from .env.local for testing
const fs = require('fs');
const path = require('path');
const https = require('https');

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
const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!API_URL) {
  console.error('❌ API_URL is not set. Check your environment variables.');
  process.exit(1);
}

// Define test function
async function testApiHealth() {
  console.log('Testing API health...');
  console.log(`API URL: ${API_URL}`);
  
  // Test API health endpoint
  const healthUrl = `${API_URL}/health`;
  console.log(`Testing connection to: ${healthUrl}`);
  
  const testHttpsRequest = () => {
    return new Promise((resolve, reject) => {
      const options = {
        headers: {
          'Accept': 'application/json',
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
            resolve({ 
              ok: false, 
              status: res.statusCode, 
              statusText: res.statusMessage, 
              data 
            });
          }
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  };
  
  try {
    const result = await testHttpsRequest();
    
    if (result.ok) {
      console.log('✅ Successfully connected to API!');
      console.log('Response:', JSON.stringify(result.data, null, 2));
      
      // Check database status if available
      if (result.data && result.data.database) {
        if (result.data.database === 'connected') {
          console.log('✅ Database is connected');
        } else {
          console.error(`❌ Database status: ${result.data.database}`);
          if (result.data.database_error) {
            console.error('Database error:', result.data.database_error);
          }
        }
      }
    } else {
      console.error(`❌ Failed to connect to API: ${result.status} ${result.statusText}`);
      console.error('Error details:', result.data);
    }
  } catch (error) {
    console.error('❌ Connection test failed with error:');
    console.error(error);
    
    // Check for common issues
    console.log('\nPossible causes:');
    console.log('1. Network connectivity issues');
    console.log('2. API server is not running or accessible');
    console.log('3. Firewall or security software is blocking the connection');
    console.log('4. API URL is incorrect');
    console.log('5. Certificate issues with HTTPS connection');
  }
}

// Run the test
testApiHealth(); 
/**
 * Test script to validate Supabase login functionality
 * Run from the frontend directory with: node scripts/test-login.js
 */

// Read from .env.local for testing
const fs = require('fs');
const path = require('path');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');

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

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Supabase credentials are not set. Check your environment variables.');
  process.exit(1);
}

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Prompt for credentials if not provided
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define test function
async function testLogin(email, password) {
  console.log('Testing Supabase login...');
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  
  try {
    console.log(`Attempting to login with email: ${email}`);
    
    // Try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ Login failed:');
      console.error(error);
      return;
    }
    
    console.log('✅ Login successful!');
    console.log(`User ID: ${data.user.id}`);
    console.log(`Email: ${data.user.email}`);
    
    // Try to fetch user profile data 
    try {
      const healthUrl = `${SUPABASE_URL}/rest/v1/profiles?select=*&user_id=eq.${data.user.id}`;
      
      const options = {
        headers: {
          'Accept': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${data.session.access_token}`
        }
      };
      
      https.get(healthUrl, options, (res) => {
        let userData = '';
        
        res.on('data', (chunk) => {
          userData += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('✅ User profile data fetch successful!');
            try {
              const profileData = JSON.parse(userData);
              console.log('User profile:', profileData);
            } catch (err) {
              console.log('User profile data (raw):', userData);
            }
          } else {
            console.error(`❌ Failed to fetch user profile: ${res.statusCode} ${res.statusMessage}`);
            console.error('Error details:', userData);
          }
          
          // Sign out
          supabase.auth.signOut().then(() => {
            console.log('✅ User signed out successfully');
          }).catch(err => {
            console.error('❌ Error signing out:', err);
          }).finally(() => {
            process.exit(0);
          });
        });
      }).on('error', (err) => {
        console.error('❌ Error fetching user profile:', err);
        process.exit(1);
      });
    } catch (error) {
      console.error('❌ Error making profile request:', error);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Login test failed with error:');
    console.error(error);
    process.exit(1);
  }
}

// Get credentials from command line arguments or prompt
const args = process.argv.slice(2);
if (args.length >= 2) {
  testLogin(args[0], args[1]);
} else {
  readline.question('Enter your email: ', (email) => {
    readline.question('Enter your password: ', (password) => {
      readline.close();
      testLogin(email, password);
    });
  });
} 
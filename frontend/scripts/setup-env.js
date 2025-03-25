const fs = require('fs');
const path = require('path');

/**
 * This script copies the environment variables from the parent directory's .env.development.local
 * to the frontend directory's .env.local file.
 * 
 * Run this script before starting the development server to ensure the frontend
 * has access to the correct environment variables.
 */

// Paths to the environment files
const parentEnvPath = path.resolve(__dirname, '../../.env.development.local');
const frontendEnvPath = path.resolve(__dirname, '../.env.local');

// Check if the parent .env.development.local file exists
if (!fs.existsSync(parentEnvPath)) {
  console.error(`Error: Parent environment file ${parentEnvPath} not found.`);
  process.exit(1);
}

try {
  // Read the parent .env.development.local file
  const envContent = fs.readFileSync(parentEnvPath, 'utf8');
  
  // Extract only the lines with NEXT_PUBLIC_ prefixes
  const nextPublicEnvVars = envContent
    .split('\n')
    .filter(line => line.trim().startsWith('NEXT_PUBLIC_'))
    .join('\n');
  
  // Create or overwrite the frontend .env.local file with the extracted variables
  fs.writeFileSync(frontendEnvPath, nextPublicEnvVars);
  
  console.log('Environment variables successfully copied to frontend/.env.local');
} catch (error) {
  console.error('Error copying environment variables:', error);
  process.exit(1);
} 
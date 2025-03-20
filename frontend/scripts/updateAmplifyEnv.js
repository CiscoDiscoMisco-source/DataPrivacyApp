/**
 * Script to extract Amplify config values from amplify_outputs.json
 * and update the .env file with them
 * 
 * Usage: node scripts/updateAmplifyEnv.js
 */

const fs = require('fs');
const path = require('path');

// Path to the amplify_outputs.json file (relative to the script)
const AMPLIFY_OUTPUTS_PATH = path.join(__dirname, '../../amplify_outputs.json');

// Path to the .env file
const ENV_FILE_PATH = path.join(__dirname, '../.env');

// Read the amplify_outputs.json file
try {
  console.log('Reading Amplify outputs from:', AMPLIFY_OUTPUTS_PATH);
  const amplifyOutputs = JSON.parse(fs.readFileSync(AMPLIFY_OUTPUTS_PATH, 'utf8'));
  
  // Extract auth configuration values
  const authConfig = amplifyOutputs.auth || {};
  
  // Get the User Pool ID, Client ID, and Identity Pool ID
  const userPoolId = authConfig.userPoolId?.value;
  const userPoolClientId = authConfig.userPoolClientId?.value;
  const identityPoolId = authConfig.identityPoolId?.value;
  
  console.log('Extracted values:');
  console.log('- User Pool ID:', userPoolId);
  console.log('- User Pool Client ID:', userPoolClientId);
  console.log('- Identity Pool ID:', identityPoolId);
  
  // Read the existing .env file
  let envContent = '';
  try {
    envContent = fs.readFileSync(ENV_FILE_PATH, 'utf8');
  } catch (error) {
    console.log('No existing .env file found, creating a new one.');
  }
  
  // Update or add the Amplify configuration values
  const updateEnvVar = (content, key, value) => {
    const regex = new RegExp(`^${key}=.*`, 'm');
    const newLine = `${key}=${value}`;
    
    if (regex.test(content)) {
      return content.replace(regex, newLine);
    } else {
      return content + (content.endsWith('\n') ? '' : '\n') + newLine + '\n';
    }
  };
  
  if (userPoolId) {
    envContent = updateEnvVar(envContent, 'REACT_APP_USER_POOL_ID', userPoolId);
  }
  
  if (userPoolClientId) {
    envContent = updateEnvVar(envContent, 'REACT_APP_USER_POOL_CLIENT_ID', userPoolClientId);
  }
  
  if (identityPoolId) {
    envContent = updateEnvVar(envContent, 'REACT_APP_IDENTITY_POOL_ID', identityPoolId);
  }
  
  // Write the updated .env file
  fs.writeFileSync(ENV_FILE_PATH, envContent);
  console.log('.env file updated successfully at:', ENV_FILE_PATH);
  
} catch (error) {
  console.error('Error updating Amplify config:', error);
  process.exit(1);
} 
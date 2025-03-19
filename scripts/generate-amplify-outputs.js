#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

console.log(`${colors.blue}Generating Amplify outputs...${colors.reset}`);

try {
  // Run amplify pull first to ensure we have the latest backend configuration
  console.log(`${colors.yellow}Running amplify pull...${colors.reset}`);
  
  // Check if the user provided specific environment params
  const hasEnvArgs = process.argv.slice(2).some(arg => 
    arg.startsWith('--appId') || arg.startsWith('--envName')
  );
  
  let pullCommand = 'amplify pull';
  
  if (hasEnvArgs) {
    // Use provided args
    pullCommand += ' ' + process.argv.slice(2).join(' ');
  } else {
    // Try to get the appId and envName from amplify configuration
    try {
      if (fs.existsSync('./amplify/.config/project-config.json')) {
        const projectConfig = JSON.parse(fs.readFileSync('./amplify/.config/project-config.json', 'utf8'));
        const localEnv = JSON.parse(fs.readFileSync('./amplify/.config/local-env-info.json', 'utf8'));
        
        pullCommand += ` --appId ${projectConfig.projectName} --envName ${localEnv.envName}`;
      }
    } catch (error) {
      console.log(`${colors.yellow}Could not determine app ID and environment from local config${colors.reset}`);
      console.log(`${colors.yellow}Please run with --appId YOUR_APP_ID --envName YOUR_ENV_NAME${colors.reset}`);
    }
  }
  
  pullCommand += ' --yes';
  execSync(pullCommand, { stdio: 'inherit' });

  // Generate the amplify outputs file
  console.log(`${colors.yellow}Generating outputs file...${colors.reset}`);
  execSync('amplify generate outputs --allow-destructive-graphql-schema-updates', { stdio: 'inherit' });

  // Verify the file exists
  if (fs.existsSync('./amplify_outputs.json')) {
    console.log(`${colors.green}Successfully generated amplify_outputs.json${colors.reset}`);
  } else {
    console.log(`${colors.red}Failed to generate amplify_outputs.json${colors.reset}`);
    process.exit(1);
  }

} catch (error) {
  console.error(`${colors.red}Error generating Amplify outputs:${colors.reset}`, error.message);
  process.exit(1);
} 
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('Generating Amplify outputs...');

try {
  // Run the basic command to generate outputs
  execSync('amplify generate outputs', { stdio: 'inherit' });

  // Verify the file exists
  if (fs.existsSync('./amplify_outputs.json')) {
    console.log('Successfully generated amplify_outputs.json');
  } else {
    console.log('Failed to generate amplify_outputs.json');
    process.exit(1);
  }
} catch (error) {
  console.error('Error generating Amplify outputs:', error.message);
  process.exit(1);
} 
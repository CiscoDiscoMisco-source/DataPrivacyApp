'use client';

import { Amplify } from 'aws-amplify';

/**
 * Initialize Amplify with the configuration
 * This should be imported and called in your root layout
 */
export function configureAmplify() {
  if (typeof window !== 'undefined') {
    try {
      // Dynamic import for the config
      const amplifyConfig = require('../../amplify_outputs.json');
      
      // Only configure Amplify on the client-side
      Amplify.configure(amplifyConfig, { ssr: true });
      console.log('Amplify configured successfully');
    } catch (error) {
      console.error('Error configuring Amplify:', error);
    }
  }
}

export default configureAmplify; 
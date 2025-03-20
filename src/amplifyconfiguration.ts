import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

// Initialize Amplify
Amplify.configure({
  API: {
    GraphQL: {
      endpoint: 'http://localhost:20002/graphql',
      region: 'us-east-1',
      defaultAuthMode: 'apiKey',
      apiKey: 'da2-dudxakwdefde7n53d2lwt5yxae'
    }
  }
});

// Generate the client
export const client = generateClient<Schema>();

// Export the client for use in components
export default client; 
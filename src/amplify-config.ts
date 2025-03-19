import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

// Initialize Amplify with hardcoded values instead of reading from amplify_outputs.json
Amplify.configure({
  API: {
    GraphQL: {
      endpoint: 'https://yd5htfzw5bahdbo77uky26adm4.appsync-api.us-east-1.amazonaws.com/graphql',
      region: 'us-east-1',
      apiKey: 'da2-odqcyla2zrf4lmne3u5rpfnuye'
    }
  },
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_gSDA0C46A',
      userPoolClientId: '6tkf89lorvpbmovosjmj7ojdba',
      identityPoolId: 'us-east-1:a3ad9767-83ff-431e-8838-be3b1e11d39b',
      region: 'us-east-1'
    }
  }
});

// Generate the client
export const client = generateClient<Schema>();

// Export the client for use in components
export default client; 
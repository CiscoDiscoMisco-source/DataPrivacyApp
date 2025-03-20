import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';

// Define minimal type for our needs
interface ResourcesConfig {
  Auth?: {
    Cognito?: {
      userPoolId?: string;
      userPoolClientId?: string;
    };
  };
  API?: {
    GraphQL?: {
      endpoint?: string;
      region?: string;
      apiKey?: string;
    };
  };
}

// Try to load ampify outputs if they exist
let resourcesConfig: ResourcesConfig = {};

try {
  const amplifyOutputs = require('../amplify_outputs.json');
  resourcesConfig = amplifyOutputs.resourcesConfig || {};
  console.log('Loaded Amplify outputs from file');
} catch (error) {
  console.warn('Could not load Amplify outputs file. Using empty configuration.', error);
}

// Configure Amplify
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || resourcesConfig?.Auth?.Cognito?.userPoolId || '',
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || resourcesConfig?.Auth?.Cognito?.userPoolClientId || '',
      loginWith: {
        email: true,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_API_ENDPOINT || resourcesConfig?.API?.GraphQL?.endpoint || '',
      region: process.env.NEXT_PUBLIC_REGION || resourcesConfig?.API?.GraphQL?.region || 'us-east-1',
      defaultAuthMode: 'userPool',
      apiKey: process.env.NEXT_PUBLIC_API_KEY || resourcesConfig?.API?.GraphQL?.apiKey,
    },
  },
}, {
  ssr: true
});

// Set up token provider
cognitoUserPoolsTokenProvider.setKeyValueStorage({
  setItem: async (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
    return Promise.resolve();
  },
  getItem: async (key: string) => {
    if (typeof window !== 'undefined') {
      return Promise.resolve(localStorage.getItem(key));
    }
    return Promise.resolve(null);
  },
  removeItem: async (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
    return Promise.resolve();
  },
  clear: async () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    return Promise.resolve();
  }
});

export default Amplify; 
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
  Storage?: {
    S3?: {
      bucket?: string;
      region?: string;
    };
  };
}

// Load config from amplify_outputs.json
let resourcesConfig: ResourcesConfig = {};

try {
  const amplifyOutputs = require('../amplify_outputs.json');
  resourcesConfig = amplifyOutputs.resourcesConfig || {};
} catch (error) {
  console.warn('Could not load Amplify outputs file.');
}

// Configure Amplify
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: resourcesConfig?.Auth?.Cognito?.userPoolId || '',
      userPoolClientId: resourcesConfig?.Auth?.Cognito?.userPoolClientId || '',
      loginWith: {
        email: true,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: resourcesConfig?.API?.GraphQL?.endpoint || '',
      region: resourcesConfig?.API?.GraphQL?.region || 'us-east-1',
      defaultAuthMode: 'userPool',
      apiKey: resourcesConfig?.API?.GraphQL?.apiKey,
    },
  },
  Storage: {
    S3: {
      bucket: resourcesConfig?.Storage?.S3?.bucket || '',
      region: resourcesConfig?.Storage?.S3?.region || 'us-east-1',
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
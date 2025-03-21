import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

// Define minimal type for our needs
interface ResourcesConfig {
  Auth?: {
    Cognito?: {
      userPoolId?: string;
      userPoolClientId?: string;
      loginWith?: {
        email?: boolean;
        oauth?: {
          domain?: string;
          scopes?: string[];
          redirectSignIn?: string[];
          redirectSignOut?: string[];
          responseType?: 'code' | 'token';
        }
      }
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

// Configure Amplify with Gen 2 settings
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: resourcesConfig?.Auth?.Cognito?.userPoolId || process.env.REACT_APP_USER_POOL_ID || 'your_userpool_id',
      userPoolClientId: resourcesConfig?.Auth?.Cognito?.userPoolClientId || process.env.REACT_APP_USER_POOL_CLIENT_ID || 'your_userpool_client_id',
      loginWith: {
        email: true,
        oauth: {
          domain: resourcesConfig?.Auth?.Cognito?.loginWith?.oauth?.domain || process.env.REACT_APP_OAUTH_DOMAIN || 'your_oauth_domain',
          scopes: resourcesConfig?.Auth?.Cognito?.loginWith?.oauth?.scopes || ['phone', 'email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
          redirectSignIn: resourcesConfig?.Auth?.Cognito?.loginWith?.oauth?.redirectSignIn || [process.env.REACT_APP_REDIRECT_SIGN_IN || 'https://localhost:3000/'],
          redirectSignOut: resourcesConfig?.Auth?.Cognito?.loginWith?.oauth?.redirectSignOut || [process.env.REACT_APP_REDIRECT_SIGN_OUT || 'https://localhost:3000/login'],
          responseType: (resourcesConfig?.Auth?.Cognito?.loginWith?.oauth?.responseType || 'code') as 'code'
        }
      }
    },
  },
  API: {
    GraphQL: {
      endpoint: resourcesConfig?.API?.GraphQL?.endpoint || process.env.REACT_APP_API_ENDPOINT || 'http://localhost:20002/graphql',
      region: resourcesConfig?.API?.GraphQL?.region || process.env.REACT_APP_REGION || 'us-east-1',
      defaultAuthMode: 'userPool',
      apiKey: resourcesConfig?.API?.GraphQL?.apiKey || process.env.REACT_APP_API_KEY || 'local-api-key',
    },
  },
  Storage: {
    S3: {
      bucket: resourcesConfig?.Storage?.S3?.bucket || process.env.REACT_APP_S3_BUCKET || '',
      region: resourcesConfig?.Storage?.S3?.region || process.env.REACT_APP_REGION || 'us-east-1',
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

// Generate data client for Gen 2
export const client = generateClient<Schema>();

export default Amplify; 
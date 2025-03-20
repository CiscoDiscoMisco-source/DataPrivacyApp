import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import awsExports from './aws-exports';

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
      userPoolId: resourcesConfig?.Auth?.Cognito?.userPoolId || awsExports.aws_user_pools_id,
      userPoolClientId: resourcesConfig?.Auth?.Cognito?.userPoolClientId || awsExports.aws_user_pools_web_client_id,
      loginWith: {
        email: true,
        oauth: {
          domain: awsExports.oauth.domain,
          scopes: awsExports.oauth.scope,
          redirectSignIn: awsExports.oauth.redirectSignIn.split(','),
          redirectSignOut: awsExports.oauth.redirectSignOut.split(','),
          responseType: 'code' as const
        }
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: resourcesConfig?.API?.GraphQL?.endpoint || awsExports.aws_appsync_graphqlEndpoint,
      region: resourcesConfig?.API?.GraphQL?.region || awsExports.aws_appsync_region || 'us-east-1',
      defaultAuthMode: 'userPool',
      apiKey: resourcesConfig?.API?.GraphQL?.apiKey || awsExports.aws_appsync_apiKey,
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
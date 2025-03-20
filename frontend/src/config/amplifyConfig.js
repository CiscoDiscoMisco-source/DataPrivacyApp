/**
 * Utility to extract Amplify configuration from amplify_outputs.json
 * This can be used in a real application to get configuration values
 */

// In a real application, this would be imported from the root
// import outputs from '../../../amplify_outputs.json';

/**
 * For this demo, we'll use environment variables instead 
 * of parsing the outputs.json file directly
 */
export const getAmplifyConfig = () => {
  return {
    Auth: {
      Cognito: {
        userPoolId: process.env.REACT_APP_USER_POOL_ID,
        userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
        identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID
      }
    }
  };
};

/**
 * Utility function to get the actual IDs using outputs from Amplify Gen2
 * In a real application, parse the amplify_outputs.json file
 */
export const extractAmplifyIds = (outputs) => {
  // Just an example - actual structure depends on your Amplify configuration
  if (!outputs || !outputs.auth) {
    return null;
  }

  return {
    userPoolId: outputs.auth.userPoolId?.value,
    userPoolClientId: outputs.auth.userPoolClientClientId?.value,
    identityPoolId: outputs.auth.identityPoolId?.value
  };
}; 
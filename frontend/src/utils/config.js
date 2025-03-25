/**
 * Application configuration based on environment
 */

// Environment detection
const getEnvironment = () => {
  return process.env.REACT_APP_ENV || process.env.NODE_ENV || 'development';
};

// Config object
const config = {
  // API settings
  api: {
    baseUrl: process.env.REACT_APP_API_URL || '/api',
    version: 'v1',
    timeout: 60000 // 60 seconds
  },
  
  // Environment
  environment: getEnvironment(),
  
  // Feature flags
  features: {
    enableSearch: true,
    enableAdvancedPreferences: process.env.REACT_APP_ENABLE_ADVANCED_PREFERENCES === 'true',
    enableAnalytics: process.env.NODE_ENV === 'production'
  },
  
  // Logging
  logging: {
    level: getEnvironment() === 'development' ? 'debug' : 'error'
  }
};

// Helper methods
export const isDevelopment = () => config.environment === 'development';
export const isTest = () => config.environment === 'test';
export const isProduction = () => config.environment === 'production';

export default config; 
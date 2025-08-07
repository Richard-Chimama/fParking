import { Platform } from 'react-native';

// Import the configuration file
// Note: Make sure to copy config.sample.json to config.json and fill in your actual values
let config: any;
try {
  config = require('../../config.json');
} catch (error) {
  console.warn('config.json not found. Please copy config.sample.json to config.json and configure your API keys.');
  config = {
    development: {},
    production: {},
    staging: {}
  };
}

// Determine the current environment
const getEnvironment = (): 'development' | 'production' | 'staging' => {
  if (__DEV__) {
    return 'development';
  }
  // You can add logic here to determine staging vs production
  // For example, based on bundle identifier or other app-specific logic
  return 'production';
};

const currentEnv = getEnvironment();
const currentConfig = config[currentEnv] || {};

export interface AppConfig {
  graphqlEndpoint: string;
  googleMapsApiKey: string;
  stripePublishableKey: string;
  oneSignalAppId: string;
  sentryDsn: string;
  amplitudeApiKey: string;
}

// Export configuration with fallback values
export const appConfig: AppConfig = {
  graphqlEndpoint: currentConfig.graphqlEndpoint || 'http://localhost:4000/graphql',
  googleMapsApiKey: currentConfig.googleMapsApiKey || '',
  stripePublishableKey: currentConfig.stripePublishableKey || '',
  oneSignalAppId: currentConfig.oneSignalAppId || '',
  sentryDsn: currentConfig.sentryDsn || '',
  amplitudeApiKey: currentConfig.amplitudeApiKey || '',
};

// Utility function to check if all required keys are configured
export const validateConfig = (): boolean => {
  const requiredKeys: (keyof AppConfig)[] = [
    'graphqlEndpoint',
    'googleMapsApiKey',
    'stripePublishableKey'
  ];
  
  const missingKeys = requiredKeys.filter(key => !appConfig[key]);
  
  if (missingKeys.length > 0) {
    console.warn('Missing required configuration keys:', missingKeys);
    return false;
  }
  
  return true;
};

// Log current environment and config status
console.log(`App running in ${currentEnv} mode`);
if (__DEV__) {
  console.log('Config validation:', validateConfig() ? 'PASSED' : 'FAILED');
}

export default appConfig;
import type { ExpoConfig } from 'expo/config';

// Dynamic app config to support EAS secret file variables for Firebase and
// sensitive variables like Google Maps API key. Provides local fallbacks so
// `expo start` and local builds work when files exist in the repo (gitignored).

const config: ExpoConfig = {
  name: 'EasyPark',
  slug: 'fParking',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.fparking.app',
    // On EAS builder, GOOGLE_SERVICE_INFO_PLIST is a file env var path.
    // Locally, fall back to gitignored file if present.
    googleServicesFile:
      process.env.GOOGLE_SERVICE_INFO_PLIST ?? './GoogleService-Info.plist',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    package: 'com.fparking.app',
    // On EAS builder, GOOGLE_SERVICES_JSON is a file env var path.
    // Locally, fall back to gitignored file if present.
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-dev-client',
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    [
      'expo-maps',
      {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY ?? '',
      },
    ],
  ],
  extra: {
    eas: {
      projectId: '84495ccf-e66b-40ff-907a-79cf882d74fc',
    },
  },
};

export default config;



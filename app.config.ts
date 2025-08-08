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
    // For iOS, use environment variable on EAS, local file for development
    googleServicesFile:
      process.env.GOOGLE_SERVICE_INFO_PLIST ?? './GoogleService-Info.plist',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY ?? '',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    package: 'com.fparking.app',
    // For Android, use environment variable on EAS, local file for development
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY ?? '',
      },
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
      'expo-dev-client',
      '@react-native-firebase/app',
      '@react-native-firebase/auth',
      'expo-maps',
    ],
  extra: {
    eas: {
      projectId: '84495ccf-e66b-40ff-907a-79cf882d74fc',
    },
  },
};

export default config;



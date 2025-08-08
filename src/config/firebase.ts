// firebase.ts - React Native Firebase Configuration (v22 Modular API)

import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase app is automatically initialized via google-services.json (Android) or GoogleService-Info.plist (iOS)
// No manual initialization needed for React Native Firebase

// Set up AsyncStorage for auth persistence (this is the default behavior)
// React Native Firebase automatically uses AsyncStorage for persistence

// --- Exports ---
export { auth };
export default auth;

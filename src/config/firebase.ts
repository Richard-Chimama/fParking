// firebase.ts - React Native Firebase Configuration (v22 Modular API)

import { getApp, getApps, initializeApp, FirebaseApp } from '@react-native-firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, FirebaseAuthTypes } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Initialize Firebase App ---
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp();
} else {
  app = getApp();
}

// --- Initialize Auth with AsyncStorage persistence ---
let auth: FirebaseAuthTypes.Module;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // If auth is already initialized, get the existing instance
  auth = getAuth(app);
}

// --- Exports ---
export { app, auth };
export default app;

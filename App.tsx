import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ApolloProvider } from '@apollo/client';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { apolloClient } from './src/apollo/client';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { AuthProvider } from './src/context/AuthContext';
// Initialize Firebase
import './src/config/firebase';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider>
          <AuthProvider>
            <BottomSheetModalProvider>
              <AppNavigator />
              <StatusBar style="auto" />
            </BottomSheetModalProvider>
          </AuthProvider>
        </ThemeProvider>
      </ApolloProvider>
    </GestureHandlerRootView>
  );
}

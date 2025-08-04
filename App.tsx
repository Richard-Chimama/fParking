import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './src/apollo/client';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ApolloProvider client={apolloClient}>
          <AppNavigator />
          <StatusBar style="auto" />
        </ApolloProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

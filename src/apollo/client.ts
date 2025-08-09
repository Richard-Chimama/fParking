import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appConfig } from '../config';

// Load Apollo Client error messages in development
if (__DEV__) {
  loadDevMessages();
  loadErrorMessages();
}

// Create HTTP link
const httpLink = createHttpLink({
  uri: appConfig.graphqlEndpoint,
});

// Error link to handle network errors and authentication errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
    // Return a mock response for development when backend is not available
    return forward(operation);
  }
  
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      console.log(
        `[GraphQL error]: Message: ${err.message}, Location: ${err.locations}, Path: ${err.path}`
      );
      
      // Handle authentication errors
      if (err.extensions?.code === 'UNAUTHENTICATED' || err.extensions?.code === 'FIREBASE_TOKEN_EXPIRED') {
        // Clear expired Firebase token
        AsyncStorage.removeItem('firebaseToken');
        // Note: Token refresh should be handled by Firebase SDK automatically
        // The AuthContext will handle re-authentication if needed
      }
    }
  }
});

// Auth link for adding authorization headers with Firebase ID token
const authLink = setContext(async (_, { headers }) => {
  // Get the Firebase ID token from local storage if it exists
  const firebaseToken = await AsyncStorage.getItem('firebaseToken');
  
  return {
    headers: {
      ...headers,
      authorization: firebaseToken ? `Bearer ${firebaseToken}` : "",
    }
  };
});

// Apollo Client instance
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  connectToDevTools: __DEV__,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});
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

// Error link to handle network errors gracefully
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
    // Return a mock response for development when backend is not available
    return forward(operation);
  }
  
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
});

// Auth link for adding authorization headers
const authLink = setContext(async (_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = await AsyncStorage.getItem('authToken');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
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
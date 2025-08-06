import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appConfig } from '../config';

// Create HTTP link
const httpLink = createHttpLink({
  uri: appConfig.graphqlEndpoint,
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
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
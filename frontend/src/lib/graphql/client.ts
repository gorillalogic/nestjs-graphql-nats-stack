import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { RootState, store } from '../../configureStore';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_HOST,
});

const authLink = setContext((_, { headers }) => {
  const { auth } = store.getState() as RootState; 

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${auth.tokens?.access_token}`,
    }
  }
});

export default new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

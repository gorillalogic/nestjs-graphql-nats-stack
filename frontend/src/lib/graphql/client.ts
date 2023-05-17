import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RootState, store } from '../../configureStore';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_HOST,
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const { auth } = store.getState() as RootState; 
  const token = auth.tokens?.access_token;

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }));

  return forward(operation);
});

const logout = () => {
  window.location.href = "/authorize?reset=1";
}

const expirationMiddleware = onError((errorResponse) => {
  if (errorResponse.graphQLErrors) {
    console.warn("Error:", errorResponse)
    errorResponse.graphQLErrors.forEach(res => {
      if (res.message == "EXPIRED_TOKEN") {
        logout();
      }
    })
  }
});

export default new ApolloClient({
  link: from([
    authMiddleware,
    expirationMiddleware,
    httpLink,
  ]),
  cache: new InMemoryCache()
});

import ApolloClient from "apollo-boost";

// the Apollo cache is set up automatically
export default new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_HOST,
});

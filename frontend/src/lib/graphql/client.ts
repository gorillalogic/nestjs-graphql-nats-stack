import ApolloClient from "apollo-boost";

// the Apollo cache is set up automatically
export default new ApolloClient({
  uri: 'http://3.88.235.94:3000/graphql'
});

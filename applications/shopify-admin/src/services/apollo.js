import ApolloClient from 'apollo-boost';

export const apolloClient = new ApolloClient({
  uri: `${process.env.API_URL}/graphql`,
  fetchOptions: {
    credentials: 'include'
  },
  request: (operation) => {
    const token = sessionStorage.getItem('authToken');

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    });
  }
});

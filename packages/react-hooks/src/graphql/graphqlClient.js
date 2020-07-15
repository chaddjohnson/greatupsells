import GraphQLClient from 'graphql-request';

const endpoint = `${process.env.API_URL}/graphql`;
const options = {
  credentials: 'include'
};
const client = new GraphQLClient(endpoint, options);

const setHeaders = () => {
  const token = sessionStorage.getItem('authToken');

  client.setHeaders({
    authorization: token ? `Bearer ${token}` : ''
  });
};

const query = async (queryString, variables) => {
  setHeaders();
  return client.request(queryString, variables);
};

const mutate = async (queryString, variables) => {
  return query(queryString, variables);
};

export default { query, mutate };

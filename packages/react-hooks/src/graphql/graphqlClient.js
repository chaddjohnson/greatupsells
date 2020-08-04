import { GraphQLClient } from 'graphql-request';

const endpoint = `${process.env.API_URL}/graphql`;
const options = {
  credentials: 'include'
};
const client = new GraphQLClient(endpoint, options);

const query = async (queryString, variables) => {
  const token = sessionStorage.getItem('authToken');

  if (token) {
    client.setHeader('Authorization', `Bearer ${token}`);
  }

  // This throws an error if the response contains an error.
  const response = await client.request(queryString, variables);

  try {
    // Determine the keys returned.
    const responseKeys = response && Object.keys(response);

    // Return the first object if there is only one.
    if (responseKeys?.length === 1) {
      return response[responseKeys[0]];
    }

    // Return all objects.
    return response;
  } catch (error) {
    // Return the original response if there was an issue working with the response.
    return response;
  }
};

const mutate = async (queryString, variables) => {
  return query(queryString, variables);
};

export default { query, mutate };

import { GraphQLClient } from 'graphql-request';

const endpoint = `${process.env.API_URL}/graphql`;
const options = {
  credentials: 'include'
};
const client = new GraphQLClient(endpoint, options);

const query = async (queryString, variables) => {
  // const token = sessionStorage.getItem('authToken');
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaG9wRG9tYWluIjoibmVhdG93ZWJzb2x1dGlvbnMtY2hhZC5teXNob3BpZnkuY29tIiwiaWF0IjoxNTk0ODQyMzkzfQ.KDBL54OYdUPxwuQN56iEYwf5KDKjPiGstSBAUfxcyfM';

  if (token) {
    client.setHeader('Authorization', `Bearer ${token}`);
  }

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
    return response;
  }
};

const mutate = async (queryString, variables) => {
  return query(queryString, variables);
};

export default { query, mutate };

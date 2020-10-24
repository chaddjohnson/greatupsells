import { GraphQLClient as GraphQLRequestClient } from 'graphql-request';

class GraphQLClient {
  constructor({ uri, interceptors, ...clientOptions }) {
    this.interceptors = {
      request: (interceptors && interceptors.request) || (() => {})
    };
    this.config = { headers: {} };
    this.client = new GraphQLRequestClient(uri, clientOptions);
  }

  async query(queryString, variables = {}) {
    const { interceptors, client, config } = this;

    // Run request interceptor.
    interceptors.request(config);

    // Set request headers.
    client.setHeaders(config.headers);

    // This throws an error if the response contains an error.
    const response = await client.request(queryString, variables || {});

    try {
      // Determine the keys returned.
      const responseKeys = response && Object.keys(response);

      // Return the first object if there is only one.
      if (responseKeys?.length === 1) {
        return response[responseKeys[0]];
      }

      // Return all objects by default.
      return response;
    } catch (error) {
      // Return the original response if there was an issue working with the response.
      return response;
    }
  }

  async mutate(queryString, variables = {}) {
    return this.query(queryString, variables);
  }
}

export default GraphQLClient;

import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const HttpClientContext = createContext(null);

const HttpClientProvider = ({ httpClient, children }) => (
  <HttpClientContext.Provider value={{ httpClient }}>
    {children}
  </HttpClientContext.Provider>
);

HttpClientProvider.propTypes = {
  client: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};

class HttpClient {
  constructor({ baseUrl, ...options }) {
    const client = axios.create();

    client.defaults.baseURL = baseUrl;
    client.defaults.timeout = 10 * 1000;
    client.defaults.headers.common['Content-Type'] =
      'application/json; charset=utf-8';

    client.defaults = {
      ...client.defaults,
      ...options
    };

    this.client = client;
  }

  // Axios options may be passed for `options`. See https://www.npmjs.com/package/axios#request-config.
  async request(method, url, data = {}, options = {}) {
    const response = await this.client({ method, url, data, ...options });

    return response?.data;
  }

  async get(url, options = {}) {
    return this.request('GET', url, {}, options);
  }

  async post(url, data = {}, options = {}) {
    return this.request('POST', url, data, options);
  }

  async put(url, data, options = {}) {
    return this.request('PUT', url, data, options);
  }

  async delete(url, options = {}) {
    return this.request('DELETE', url, {}, options);
  }

  addRequestInterceptor(callback) {
    this.client.interceptors.request.use(callback);
  }
}

const useHttpClient = () => useContext(HttpClientContext);

export { HttpClientProvider, HttpClient, useHttpClient };

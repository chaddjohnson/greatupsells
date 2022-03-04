import React from 'react';
import { HttpClientProvider, HttpClient } from '@greatupsells/react-hooks';
import { CartProvider } from './hooks';
import { Offers } from './components';

const httpClient = new HttpClient({
  baseUrl: process.env.STOREFRONT_API_URL
});

const App = () => (
  <HttpClientProvider httpClient={httpClient}>
    <CartProvider>
      <Offers />
    </CartProvider>
  </HttpClientProvider>
);

export default App;

import React from 'react';
import { HttpClientProvider } from '@greatupsells/react-hooks';
import { CartProvider } from './hooks';
import { Offers } from './components';

const App = () => (
  <HttpClientProvider baseUrl={process.env.STOREFRONT_API_URL}>
    <CartProvider>
      <Offers />
    </CartProvider>
  </HttpClientProvider>
);

export default App;

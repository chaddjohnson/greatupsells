import React from 'react';
import {
  HttpClientProvider,
  HttpClient
} from '@neatowebsolutions/upselling-react-hooks';
import {
  CartOffer,
  CheckoutOffer,
  ExitIntentOffer,
  ProductOffer,
  ShopVisitOffer
} from './components';

const httpClient = new HttpClient({
  baseUrl: process.env.STOREFRONT_API_URL
});

const App = () => (
  <HttpClientProvider httpClient={httpClient}>
    <CartOffer />
    <CheckoutOffer />
    <ExitIntentOffer />
    <ProductOffer />
    <ShopVisitOffer />
  </HttpClientProvider>
);

export default App;

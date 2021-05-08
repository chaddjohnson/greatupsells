import React from 'react';
import {
  HttpClientProvider,
  HttpClient
} from '@neatowebsolutions/upselling-react-hooks';
import {
  ProductOffer,
  CartOffer,
  ExitIntentOffer,
  AnyPageLoadOffer,
  SpecificPageLoadOffer
} from './components';

const httpClient = new HttpClient({
  baseUrl: process.env.STOREFRONT_API_GATEWAY_URL
});

const App = () => (
  <HttpClientProvider httpClient={httpClient}>
    <ProductOffer />
    <CartOffer />
    <ExitIntentOffer />
    <AnyPageLoadOffer />
    <SpecificPageLoadOffer />
  </HttpClientProvider>
);

export default App;

import React from 'react';
import {
  HttpClientProvider,
  HttpClient
} from '@neatowebsolutions/upselling-react-hooks';
import {
  AnyPageLoadOffer,
  CartOffer,
  ExitIntentOffer,
  LostBrowserFocusOffer,
  ProductOffer,
  SpecificPageLoadOffer
} from './components';

const httpClient = new HttpClient({
  baseUrl: process.env.STOREFRONT_API_GATEWAY_URL
});

const App = () => (
  <HttpClientProvider httpClient={httpClient}>
    <AnyPageLoadOffer />
    <CartOffer />
    <ExitIntentOffer />
    <LostBrowserFocusOffer />
    <ProductOffer />
    <SpecificPageLoadOffer />
  </HttpClientProvider>
);

export default App;

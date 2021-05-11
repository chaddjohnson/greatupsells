import React from 'react';
import {
  HttpClientProvider,
  HttpClient
} from '@neatowebsolutions/upselling-react-hooks';
import {
  CartOffer,
  ExitIntentOffer,
  LinkClickOffer,
  LostBrowserFocusOffer,
  PageLoadOffer,
  PageScrollOffer,
  ProductOffer
} from './components';

const httpClient = new HttpClient({
  baseUrl: process.env.STOREFRONT_API_GATEWAY_URL
});

const App = () => (
  <HttpClientProvider httpClient={httpClient}>
    <CartOffer />
    <ExitIntentOffer />
    <LinkClickOffer />
    <LostBrowserFocusOffer />
    <PageLoadOffer />
    <PageScrollOffer />
    <ProductOffer />
  </HttpClientProvider>
);

export default App;

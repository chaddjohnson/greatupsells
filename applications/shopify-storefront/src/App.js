import React from 'react';
import {
  HttpClientProvider,
  HttpClient
} from '@neatowebsolutions/upselling-react-hooks';
import { CartProvider } from './hooks';
import {
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
    <CartProvider>
      <ExitIntentOffer />
      <LinkClickOffer />
      <LostBrowserFocusOffer />
      <PageLoadOffer />
      <PageScrollOffer />
      <ProductOffer />
    </CartProvider>
  </HttpClientProvider>
);

export default App;

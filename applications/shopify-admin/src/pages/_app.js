import { useState, useEffect } from 'react';
import translations from '@shopify/polaris/locales/en.json';
import { AppProvider } from '@shopify/polaris';
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';
import Cookies from 'universal-cookie';
import styled from 'styled-components';
import { ErrorBoundary } from '@neatowebsolutions/upselling-react-components';
import {
  HttpClientProvider,
  HttpClient
} from '@neatowebsolutions/upselling-react-hooks';
import { ShopProvider } from '../hooks';
import { Link, RoutePropagator } from '../components';
import '@shopify/polaris/dist/styles.css';

const cookies = new Cookies();

const httpClient = new HttpClient({
  baseUrl: process.env.SHOP_API_GATEWAY_URL
});

// Add the token to each request.
httpClient.addRequestInterceptor((config) => {
  const token = sessionStorage.authToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const Main = styled.main`
  padding-bottom: 120px;
`;

const App = ({ Component, pageProps }) => {
  const shopOrigin = cookies.get('shopOrigin');
  const authToken = cookies.get('authToken');

  const [mounted, setMounted] = useState(false);

  // Copy cookie values to session storage so that multiple instances of this app may
  // be used across multiple shops simultaneously.
  if (typeof window !== 'undefined') {
    sessionStorage.shopOrigin = shopOrigin;
    sessionStorage.authToken = authToken;
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AppProvider i18n={translations} linkComponent={Link}>
      <AppBridgeProvider
        config={{
          apiKey: process.env.SHOPIFY_ADMIN_APP_API_KEY,
          shopOrigin,
          forceRedirect: true
        }}
      >
        <HttpClientProvider httpClient={httpClient}>
          <ShopProvider>
            <RoutePropagator />
            {mounted &&
              typeof window !== 'undefined' &&
              window.top !== window.self && (
                <ErrorBoundary>
                  <Main>
                    <Component {...pageProps} />
                  </Main>
                </ErrorBoundary>
              )}
            {mounted &&
              typeof window !== 'undefined' &&
              window.top === window.self && <p>Loading...</p>}
          </ShopProvider>
        </HttpClientProvider>
      </AppBridgeProvider>
    </AppProvider>
  );
};

export default App;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import translations from '@shopify/polaris/locales/en.json';
import { AppProvider } from '@shopify/polaris';
import createApp from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';
import {
  Provider as AppBridgeProvider,
  ClientRouter
} from '@shopify/app-bridge-react';

import { getSessionToken } from '@shopify/app-bridge-utils';
import styled from 'styled-components';
import { ErrorBoundary } from '@greatupsells/react-components';
import { HttpClientProvider, HttpClient } from '@greatupsells/react-hooks';
import { ShopProvider } from '../hooks';
import { Link, RoutePropagator } from '../components';
import '@shopify/polaris/dist/styles.css';

const apiKey = process.env.SHOPIFY_ADMIN_APP_API_KEY;

const httpClient = new HttpClient({
  baseUrl: process.env.SHOPIFY_ADMIN_API_URL
});

const getShop = () => {
  const isClientSide = typeof window !== 'undefined';

  if (!isClientSide) {
    return undefined;
  }

  if (sessionStorage.shop) {
    return sessionStorage.shop;
  }

  const shop = new URLSearchParams(window.location.search).get('shop');

  return shop;
};

const getHost = () => {
  const isClientSide = typeof window !== 'undefined';

  if (!isClientSide) {
    return undefined;
  }

  if (sessionStorage.host) {
    return sessionStorage.host;
  }

  const shop = getShop();
  const host =
    shop && shop.includes('.') ? window.btoa(`${shop}/admin`) : undefined;

  return host;
};

const initiateOauth = () => {
  const host = getHost();
  const shop = getShop();
  const app = createApp({ apiKey, host });
  const redirect = Redirect.create(app);

  redirect.dispatch(
    Redirect.Action.REMOTE,
    `https://${window.location.host}/auth?shop=${shop}`
  );
};

const getAuthToken = async () => {
  // Get a JWT via Shopify.
  const host = getHost();
  const app = createApp({ apiKey, host });
  const shopifySessionToken = await getSessionToken(app);

  try {
    // Retrieve a custom access token tailored to this application using Shopify's
    // session token.
    const response = await (
      await fetch(`/authToken?shopifySessionToken=${shopifySessionToken}`)
    ).json();

    return response.authToken;
  } catch (error) {
    initiateOauth();
  }
};

// Add the token to each request.
httpClient.addRequestInterceptor(async (config) => {
  try {
    let { authToken } = sessionStorage;

    if (!authToken) {
      authToken = await getAuthToken();

      if (authToken) {
        sessionStorage.authToken = authToken;
      }
    }

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  } catch (error) {
    return config;
  }
});

const Main = styled.main`
  padding-bottom: 120px;
`;

const App = ({ Component, pageProps }) => {
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  const shop = getShop();
  const host = getHost();
  const forceRedirect = true;
  const appBridgeConfig = { apiKey, host, forceRedirect };

  if (typeof window !== 'undefined') {
    sessionStorage.shop = shop;
    sessionStorage.host = host;
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AppProvider i18n={translations} linkComponent={Link}>
      <AppBridgeProvider config={appBridgeConfig}>
        <HttpClientProvider httpClient={httpClient}>
          <ShopProvider>
            {mounted &&
              typeof window !== 'undefined' &&
              window.top !== window.self && (
                <>
                  <ClientRouter history={router} />
                  <RoutePropagator />
                  <ErrorBoundary>
                    <Main>
                      <Component {...pageProps} />
                    </Main>
                  </ErrorBoundary>
                </>
              )}
            {mounted &&
              typeof window !== 'undefined' &&
              window.top === window.self && <h1>Loading...</h1>}
          </ShopProvider>
        </HttpClientProvider>
      </AppBridgeProvider>
    </AppProvider>
  );
};

export default App;

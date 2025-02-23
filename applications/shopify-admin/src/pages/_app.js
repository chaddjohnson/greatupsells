import { useState, useEffect } from 'react';
import Head from 'next/head';
import translations from '@shopify/polaris/locales/en.json';
import { AppProvider } from '@shopify/polaris';
import createApp from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';
import { getSessionToken } from '@shopify/app-bridge/utilities';
import { NavMenu } from '@shopify/app-bridge-react';
import styled from 'styled-components';
import { ErrorBoundary } from '@greatupsells/react-components';
import { HttpClientProvider } from '@greatupsells/react-hooks';
import { ShopProvider } from '../hooks';
import { Link, RouteGuard } from '../components';
import '@shopify/polaris/build/esm/styles.css';

const apiKey = process.env.SHOPIFY_ADMIN_APP_API_KEY;

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

  // const shop = getShop();
  // const host = shop?.includes('.') ? window.btoa(`${shop}/admin`) : undefined;
  const host = new URLSearchParams(window.location.search).get('host');

  return host;
};

const initiateOauth = () => {
  const host = getHost();
  const shop = getShop();
  const forceRedirect = true;
  const app = createApp({ apiKey, host, forceRedirect });
  const redirect = Redirect.create(app);
  const url = `https://${window.location.host}/auth?shop=${shop}`;

  redirect.dispatch(Redirect.Action.REMOTE, url);
};

const getAuthToken = async () => {
  // Get a JWT via Shopify.
  const host = getHost();
  const forceRedirect = true;
  const app = createApp({ apiKey, host, forceRedirect });
  const shopifySessionToken = await getSessionToken(app);

  try {
    // Retrieve a custom access token tailored to this application using Shopify's
    // session token.
    const url = `/authToken?shopifySessionToken=${shopifySessionToken}`;
    const response = await fetch(url);
    const json = await response.json();

    return json.authToken;
  } catch (error) {
    initiateOauth();
  }
};

// Add the token to each request.
const httpRequestInterceptor = async (config) => {
  try {
    let { authToken } = sessionStorage;

    if (!authToken) {
      authToken = await getAuthToken();

      if (authToken) {
        sessionStorage.authToken = authToken;
      }
    }

    if (authToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  } catch (error) {
    return config;
  }
};

const Main = styled.main`
  padding-bottom: 120px;
`;

const App = ({ Component, pageProps, host = getHost(), shop = getShop() }) => {
  const [mounted, setMounted] = useState(false);

  if (typeof window !== 'undefined') {
    sessionStorage.shop = shop;
    sessionStorage.host = host;

    if (!sessionStorage.authToken) {
      getAuthToken();
    }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Head>
        <meta name="shopify-api-key" content={process.env.SHOPIFY_ADMIN_APP_API_KEY} />
        <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
      </Head>
      <AppProvider i18n={translations} linkComponent={Link}>
        <NavMenu>
          <a href="/" rel="home">
            Dashboard
          </a>
          <a href="/offers">Offers</a>
          <a href="/analytics">Analytics</a>
          <a href="/offers/new">Create offer</a>
        </NavMenu>
        <HttpClientProvider baseUrl={process.env.SHOPIFY_ADMIN_API_URL} requestInterceptor={httpRequestInterceptor}>
          <ShopProvider>
            {mounted && typeof window !== 'undefined' && window.top !== window.self && (
              <RouteGuard>
                <ErrorBoundary>
                  <Main>
                    <Component {...pageProps} />
                  </Main>
                </ErrorBoundary>
              </RouteGuard>
            )}
            {mounted && typeof window !== 'undefined' && window.top === window.self && <h1>Loading...</h1>}
          </ShopProvider>
        </HttpClientProvider>
      </AppProvider>
    </>
  );
};

App.getInitialProps = async ({ ctx }) => {
  return {
    host: ctx.query.host,
    shop: ctx.query.shop
  };
};

export default App;

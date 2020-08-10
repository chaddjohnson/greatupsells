import translations from '@shopify/polaris/locales/en.json';
import { AppProvider } from '@shopify/polaris';
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';
import {
  ErrorBoundary,
  Contexts
} from '@neatowebsolutions/upselling-react-components';
import { getCookie } from '@neatowebsolutions/upselling-utilities';
import { Link, RoutePropagator } from '../components';
import '@shopify/polaris/dist/styles.css';

const App = ({ Component, pageProps }) => {
  const shopOrigin = getCookie('shopOrigin');
  const authToken = getCookie('authToken');

  // Copy cookie values to session storage so that multiple instances of this app may
  // be used across multiple shops simultaneously.
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('shopOrigin', shopOrigin);
    sessionStorage.setItem('authToken', authToken);
  }

  return (
    <AppProvider i18n={translations} linkComponent={Link}>
      <AppBridgeProvider
        config={{
          apiKey: process.env.SHOPIFY_ADMIN_API_KEY,
          shopOrigin,
          forceRedirect: true
        }}
      >
        <RoutePropagator />
        {typeof window === 'undefined' ||
          (window.top !== window.self && (
            <ErrorBoundary>
              <Contexts>
                <main
                  style={{
                    paddingBottom: '120px'
                  }}
                >
                  <Component {...pageProps} />
                </main>
              </Contexts>
            </ErrorBoundary>
          ))}
        {typeof window !== 'undefined' && window.top === window.self && (
          <p>Loading...</p>
        )}
      </AppBridgeProvider>
    </AppProvider>
  );
};

export default App;

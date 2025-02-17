import { useEffect } from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { HttpClientProvider } from '@greatupsells/react-hooks';
import theme from '../theme';
import { ToastProvider } from '../hooks';
import '../theme/index.css';

// Add the token to each request.
const httpRequestInterceptor = (config) => {
  const token = sessionStorage.authToken;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

const App = ({ Component, ...pageProps }) => {
  // Remove the server-side injected CSS.
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');

    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <HttpClientProvider baseUrl={process.env.ADMIN_API_URL} requestInterceptor={httpRequestInterceptor}>
        <ThemeProvider theme={theme}>
          <ToastProvider>
            <CssBaseline />
            <Component {...pageProps} />
          </ToastProvider>
        </ThemeProvider>
      </HttpClientProvider>
    </>
  );
};

export default App;

import { useEffect } from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import {
  HttpClientProvider,
  HttpClient
} from '@neatowebsolutions/upselling-react-hooks';
import theme from '../theme';
import { ToastProvider } from '../hooks';
import '../theme/index.css';

const httpClient = new HttpClient({
  baseUrl: process.env.ADMIN_API_GATEWAY_URL
});

// Add the token to each request.
httpClient.addRequestInterceptor((config) => {
  const token = sessionStorage.authToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

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
      <HttpClientProvider httpClient={httpClient}>
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

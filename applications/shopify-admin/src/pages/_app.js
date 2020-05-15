import App from 'next/app';
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';
import translations from '@shopify/polaris/locales/en.json';
import { AppProvider } from '@shopify/polaris';
import Cookies from 'js-cookie';
import { ApolloProvider } from '@apollo/react-hooks';
import { Link, RoutePropagator } from '../components';
import { apolloClient } from '../services';
import { getAuthToken } from '../utilities';
import '@shopify/polaris/styles.scss';

export default class extends App {
  async componentDidMount() {
    await getAuthToken();
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <AppBridgeProvider
        config={{
          apiKey: process.env.SHOPIFY_APP_API_KEY,
          shopOrigin: Cookies.get('shopOrigin'),
          forceRedirect: true
        }}
      >
        <AppProvider i18n={translations} linkComponent={Link}>
          <RoutePropagator />
          <ApolloProvider client={apolloClient}>
            <Component {...pageProps} />
          </ApolloProvider>
        </AppProvider>
      </AppBridgeProvider>
    );
  }
}

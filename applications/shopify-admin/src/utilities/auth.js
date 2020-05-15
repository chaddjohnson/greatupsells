import createApp from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';
import Cookies from 'js-cookie';
import { apolloClient } from '../services';
import { SHOP_TOKEN } from '../graphql/queries';

const initializeAuth = () => {
  const appConfig = {
    apiKey: process.env.SHOPIFY_APP_API_KEY,
    shopOrigin: Cookies.get('shopOrigin')
  };
  const app = createApp(appConfig);
  const redirect = Redirect.create(app);

  if (window.top === window.self) {
    window.top.location.href = `${
      process.env.SHOPIFY_APP_URL
    }/auth?shop=${Cookies.get('shopOrigin')}`;
  } else {
    redirect.dispatch(Redirect.Action.REMOTE, {
      url: `${process.env.SHOPIFY_APP_URL}/auth?shop=${Cookies.get(
        'shopOrigin'
      )}`,
      newContext: false
    });
  }
};

export const getAuthToken = async () => {
  const queryString = window.location.search;

  if (!queryString) {
    return;
  }

  try {
    const result = await apolloClient.query({
      query: SHOP_TOKEN,
      variables: {
        queryString
      }
    });

    // Save the auth token to sessionStorage for runtime use in the current tab only.
    sessionStorage.setItem('authToken', result.data.shopToken.token);
  } catch (error) {
    initializeAuth();
  }
};

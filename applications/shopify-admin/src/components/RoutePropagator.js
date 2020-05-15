import { useContext } from 'react';
import { withRouter } from 'next/router';
import { RoutePropagator } from '@shopify/react-shopify-app-route-propagator';
import { Context } from '@shopify/app-bridge-react';

export default withRouter(({ router, server }) => {
  const app = useContext(Context);

  return !server && app && router.pathname ? (
    <RoutePropagator location={router.pathname} app={app} />
  ) : null;
});

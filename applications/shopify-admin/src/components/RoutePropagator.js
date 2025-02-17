import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { useAppBridge, RoutePropagator as AppBridgeRoutePropagator } from '@shopify/app-bridge-react';

const RoutePropagator = ({ router }) => {
  const app = useAppBridge();
  const badPath = !!router.asPath.match(/\[[^\]]+\]/);

  // Work around Next.js bug where URL swaps to use placeholders.
  if (!app || badPath) {
    return null;
  }

  return app && !badPath ? <AppBridgeRoutePropagator location={router.asPath} /> : null;
};

RoutePropagator.propTypes = {
  router: PropTypes.object.isRequired
};

export default withRouter(RoutePropagator);

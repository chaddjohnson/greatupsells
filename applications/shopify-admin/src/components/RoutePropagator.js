import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { RoutePropagator as AppBridgeRoutePropagator } from '@shopify/app-bridge-react';

const RoutePropagator = ({ router }) => {
  const badPath = !!router.asPath.match(/\[[^\]]+\]/);

  // Work around Next.js bug where URL swaps to use placeholders.
  if (badPath) {
    return null;
  }

  return <AppBridgeRoutePropagator location={router.asPath} />;
};

RoutePropagator.propTypes = {
  router: PropTypes.object.isRequired
};

export default withRouter(RoutePropagator);

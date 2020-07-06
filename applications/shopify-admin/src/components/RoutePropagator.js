import React from 'react';
import { withRouter } from 'next/router';
import { RoutePropagator as AppBridgeRoutePropagator } from '@shopify/app-bridge-react';

/* eslint-disable react/prop-types */
const RoutePropagator = ({ router }) => (
  <AppBridgeRoutePropagator location={router.pathname} />
);
/* eslint-enable react/prop-types */

export default withRouter(RoutePropagator);

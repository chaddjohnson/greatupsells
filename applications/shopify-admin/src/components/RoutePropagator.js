import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { RoutePropagator as AppBridgeRoutePropagator } from '@shopify/app-bridge-react';

const RoutePropagator = ({ router }) => (
  <AppBridgeRoutePropagator location={router.asPath} />
);

RoutePropagator.propTypes = {
  router: PropTypes.object.isRequired
};

export default withRouter(RoutePropagator);

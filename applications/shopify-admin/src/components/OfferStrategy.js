import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from '@shopify/polaris';

const strategyMap = {
  CROSS_SELL: 'Cross-sell',
  UPSELL: 'Upsell',
  POST_PURCHASE: 'Post-purchase',
  THANK_YOU_PAGE: 'Thank You page',
  ORDER_STATUS_PAGE: 'Order Status page',
  POPUP: 'Popup'
};

const OfferStrategy = ({ offer }) => (strategyMap[offer.strategy] ? <Tag>{strategyMap[offer.strategy]}</Tag> : null);

OfferStrategy.propTypes = {
  offer: PropTypes.object.isRequired
};

export default OfferStrategy;

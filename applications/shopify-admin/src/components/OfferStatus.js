import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from '@shopify/polaris';

const OfferStatus = ({ offer }) => {
  if (!offer?._id) {
    return null;
  }

  if (!offer.enabled) {
    return <Badge size="small">Disabled</Badge>;
  }

  if (offer.endAt && new Date(offer.endAt) < new Date()) {
    return (
      <Badge status="warning" size="small">
        Expired
      </Badge>
    );
  }

  if (new Date(offer.startAt) > new Date()) {
    return (
      <Badge status="info" size="small">
        Pending
      </Badge>
    );
  }

  if (offer.enabled) {
    return (
      <Badge status="success" size="small">
        Active
      </Badge>
    );
  }

  return null;
};

OfferStatus.propTypes = {
  offer: PropTypes.object.isRequired
};

export default OfferStatus;

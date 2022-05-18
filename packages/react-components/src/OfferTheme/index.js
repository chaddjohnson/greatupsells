import React from 'react';
import PropTypes from 'prop-types';
import { MultiProductOffer2 } from '@greatupsells/themes';
import useOfferThemeState from './offerThemeState';
import useOfferThemeVariables from './offerThemeVariables';

const OfferTheme = ({
  context,
  shop,
  offer,
  theme,
  locale,
  countryCode,
  currency,
  triggerProduct,
  offeredProducts,
  shopifyCartItems,
  shopifyCartTotal,
  shopifyCartItemCount,
  handlers,
  onAddProducts,
  onReplaceProduct
}) => {
  const themeVariables = useOfferThemeVariables(offer, theme);

  // Set up data binding for popup.
  const state = useOfferThemeState({
    shop,
    offer,
    locale,
    countryCode,
    currency,
    triggerProduct,
    offeredProducts,
    shopifyCartItems,
    shopifyCartTotal,
    shopifyCartItemCount,
    onAddProducts,
    onReplaceProduct,
    handlers
  });

  if (!offer) {
    return null;
  }

  return (
    <MultiProductOffer2
      context={context}
      theme={themeVariables}
      state={state}
    />
  );
};

OfferTheme.propTypes = {
  context: PropTypes.object,
  shop: PropTypes.object.isRequired,
  offer: PropTypes.object.isRequired,
  locale: PropTypes.string,
  countryCode: PropTypes.string,
  currency: PropTypes.string,
  triggerProduct: PropTypes.object,
  offeredProducts: PropTypes.arrayOf(PropTypes.object),
  theme: PropTypes.object.isRequired,
  shopifyCartItems: PropTypes.array,
  shopifyCartTotal: PropTypes.number,
  shopifyCartItemCount: PropTypes.number,
  handlers: PropTypes.object,
  // forceDisplayType: PropTypes.oneOf(['desktop', 'mobile']),
  onAddProducts: PropTypes.func,
  onReplaceProduct: PropTypes.func
};

OfferTheme.defaultProps = {
  locale: 'en',
  countryCode: 'US',
  currency: 'USD',
  handlers: {}
};

export default OfferTheme;

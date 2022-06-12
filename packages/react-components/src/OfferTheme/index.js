import React from 'react';
import PropTypes from 'prop-types';
import useOfferThemeState from './offerThemeState';
import useOfferThemeVariables from './offerThemeVariables';

const OfferTheme = ({
  context,
  shop,
  offer,
  theme,
  ThemeComponent,
  locale,
  countryCode,
  currency,
  triggerProduct,
  offeredProducts,
  shopifyCartItems,
  shopifyCartTotal,
  shopifyCartItemCount,
  forceDisplayType,
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

  if (!offer || !ThemeComponent) {
    return null;
  }

  return (
    <ThemeComponent
      context={context}
      theme={themeVariables}
      state={{ ...state, forceDisplayType }}
    />
  );
};

OfferTheme.propTypes = {
  context: PropTypes.object,
  shop: PropTypes.object.isRequired,
  offer: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  ThemeComponent: PropTypes.node,
  locale: PropTypes.string,
  countryCode: PropTypes.string,
  currency: PropTypes.string,
  triggerProduct: PropTypes.object,
  offeredProducts: PropTypes.arrayOf(PropTypes.object),
  shopifyCartItems: PropTypes.array,
  shopifyCartTotal: PropTypes.number,
  shopifyCartItemCount: PropTypes.number,
  forceDisplayType: PropTypes.oneOf(['desktop', 'mobile']),
  handlers: PropTypes.object,
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

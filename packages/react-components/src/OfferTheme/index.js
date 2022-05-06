import React from 'react';
import PropTypes from 'prop-types';
import { MultiProductOffer1 } from '@greatupsells/themes';
import useOfferThemeState from './offerThemeState';
import useOfferThemeVariables from './offerThemeVariables';

const OfferTheme = ({
  context,
  shop,
  offer,
  locale,
  countryCode,
  currency,
  triggerProduct,
  offeredProducts,
  theme,
  shopifyCartItems,
  shopifyCartTotal,
  shopifyCartItemCount,
  handlers,
  // forceDisplayType,
  onAddProducts,
  onReplaceProduct
}) => {
  const themeVariables = useOfferThemeVariables(offer, theme);

  // Replace device-specific media queries if forcing display type.
  // Reference: https://github.com/cypress-io/cypress/issues/970#issuecomment-767860917
  // if (forceDisplayType === 'desktop') {
  //   // Add "device" to media queries if missing.
  //   css = css?.replace(
  //     /(\(\s*)(min|max)-(width|height)(\s*:)/g,
  //     '$1$2-device-$3$4'
  //   );
  // } else if (forceDisplayType === 'mobile') {
  //   // Remove "device" from media queries if present.
  //   css = css?.replace(
  //     /(\(\s*)(min|max)-device-(width|height)(\s*:)/g,
  //     '$1$2-$3$4'
  //   );
  // }

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
    <MultiProductOffer1
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

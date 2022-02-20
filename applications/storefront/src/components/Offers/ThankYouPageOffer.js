import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { OfferTheme } from '@greatupsells/react-components';
import { useOfferTracking, useOfferAcceptance } from '../../hooks';

const ThankYouPageOffer = ({
  shop,
  offer,
  theme,
  locale,
  countryCode,
  currency,
  triggerProduct,
  offeredProducts
}) => {
  const [added, setAdded] = useState(false);
  const { trackOfferImpression } = useOfferTracking();
  const { addProducts, replaceProduct } = useOfferAcceptance();

  const offerId = offer?._id;
  const offeredShopifyProductIds = useMemo(
    () =>
      offeredProducts?.map(({ shopifyProductData }) => shopifyProductData?.id),
    [offeredProducts]
  );
  const title = useMemo(
    () =>
      theme?.variables.find(({ name }) => name === 'titleText')?.value ||
      'Recommended',
    [theme]
  );

  const headerContainer = document.querySelector(
    '.step__sections > .section > .section__content .content-box:nth-of-type(2) .content-box__row:nth-of-type(1)'
  );
  const contentContainer = document.querySelector(
    '.step__sections > .section > .section__content .content-box:nth-of-type(2) .content-box__row:nth-of-type(2)'
  );

  useEffect(() => {
    if (!headerContainer) {
      return;
    }

    if (!headerContainer.classList.contains('content-box__row--no-border')) {
      headerContainer.classList.add('content-box__row--no-border');
    }
  }, [headerContainer]);

  useEffect(() => {
    if (!window.Shopify.Checkout) {
      return;
    }

    if (window.Shopify.Checkout.page !== 'thank_you') {
      return;
    }

    if (!offerId) {
      return;
    }

    if (added) {
      return;
    }

    window.Shopify.Checkout.OrderStatus.addContentBox(`<h2>${title}</h2>`, '');

    setAdded(true);

    trackOfferImpression({
      offerId,
      offeredShopifyProductIds
    });
  }, [offerId, added, offeredShopifyProductIds, trackOfferImpression, title]);

  if (!contentContainer) {
    return null;
  }

  if (!offer || !shop || !added) {
    return null;
  }

  return createPortal(
    <OfferTheme
      shop={shop}
      offer={offer}
      locale={locale}
      countryCode={countryCode}
      currency={currency}
      triggerProduct={triggerProduct}
      offeredProducts={offeredProducts}
      theme={theme}
      context={window}
      container={contentContainer}
      onAddProducts={addProducts}
      onReplaceProduct={replaceProduct}
    />,
    contentContainer
  );
};

ThankYouPageOffer.propTypes = {
  shop: PropTypes.object.isRequired,
  offer: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  triggerProduct: PropTypes.object,
  offeredProducts: PropTypes.array.isRequired
};

export default ThankYouPageOffer;

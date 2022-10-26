import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { OfferTheme } from '@greatupsells/react-components';
import { useOfferTracking, useOfferAcceptance } from '../../hooks';

const OrderStatusPageOffer = ({
  shop,
  offer,
  theme,
  ThemeComponent,
  locale,
  countryCode,
  currency,
  triggerProduct,
  offeredProducts
}) => {
  const [lastShop, setLastShop] = useState(shop);
  const [lastOffer, setLastOffer] = useState(offer);
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

  const isOrderStatusPage = window.Shopify?.Checkout?.isOrderStatusPage;

  const headerContainer = document.querySelector(
    '.step__sections > .section > .section__content .content-box:nth-last-child(2) .content-box__row:nth-of-type(1)'
  );
  const contentContainer = document.querySelector(
    '.step__sections > .section > .section__content .content-box:nth-last-child(2) .content-box__row:nth-of-type(2)'
  );

  // Use the last non-empty values.
  const cachedShop = useMemo(() => shop || lastShop, [shop, lastShop]);
  const cachedOffer = useMemo(() => offer || lastOffer, [offer, lastOffer]);

  // Track the last non-empty values.
  useEffect(() => {
    if (shop) {
      setLastShop(shop);
    }
    if (offer) {
      setLastOffer(offer);
    }
  }, [shop, offer]);

  useEffect(() => {
    if (!headerContainer) {
      return;
    }

    if (
      added &&
      !headerContainer.classList.contains('content-box__row--no-border')
    ) {
      headerContainer.classList.add('content-box__row--no-border');
    }
  }, [added, headerContainer]);

  useEffect(() => {
    if (!isOrderStatusPage) {
      return;
    }

    if (!cachedOffer) {
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
  }, [
    cachedOffer,
    offerId,
    added,
    offeredShopifyProductIds,
    trackOfferImpression,
    title,
    isOrderStatusPage
  ]);

  if (!contentContainer) {
    return null;
  }

  if (!cachedOffer || !cachedShop || !added) {
    return null;
  }

  return createPortal(
    <OfferTheme
      context={window}
      shop={cachedShop}
      offer={cachedOffer}
      theme={theme}
      ThemeComponent={ThemeComponent}
      locale={locale}
      countryCode={countryCode}
      currency={currency}
      triggerProduct={triggerProduct}
      offeredProducts={offeredProducts}
      onAddProducts={addProducts}
      onReplaceProduct={replaceProduct}
    />,
    contentContainer
  );
};

OrderStatusPageOffer.propTypes = {
  shop: PropTypes.object.isRequired,
  offer: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  triggerProduct: PropTypes.object,
  offeredProducts: PropTypes.array.isRequired
};

export default OrderStatusPageOffer;

import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import { usePushStateListener } from '@neatowebsolutions/upselling-react-hooks';
import { useOfferTracking, useShop, useShopifyCart } from '../../hooks';

const loadedAt = new Date();

const PageLoadOffer = ({ offer, popupTheme, offeredProducts }) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [offerViewed, setOfferViewed] = useState(false);

  const { addProductToShopifyCart } = useShopifyCart();
  const { trackOfferImpression, trackOfferAcceptance } = useOfferTracking();
  const { shop } = useShop();

  const offerId = offer?._id;

  const openPopup = useCallback(() => {
    const delay = (offer?.delaySeconds || 0) * 1000;

    setOfferViewed(true);

    setTimeout(async () => {
      const offeredShopifyProductIds = offeredProducts.map(
        ({ shopifyProductData }) => shopifyProductData?.id
      );
      const offeredShopifyVariantIds = offeredProducts.map(
        ({ shopifyProductData }) => shopifyProductData?.variants?.[0]?.id
      );

      setPopupOpen(true);

      await trackOfferImpression({
        offerId,
        offeredShopifyProductIds,
        offeredShopifyVariantIds
      });
    }, delay);
  }, [offer, offerId, offeredProducts, trackOfferImpression]);

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleAddProduct = async (
    shopifyProductId,
    shopifyVariantId,
    quantity
  ) => {
    // Add the product to the cart.
    if (shopifyVariantId) {
      await addProductToShopifyCart(shopifyProductId, quantity);
    }

    // Accept the offer.
    await trackOfferAcceptance(
      offerId,
      shopifyProductId,
      shopifyVariantId,
      quantity
    );
  };

  // Listen to pushState events.
  usePushStateListener(() => {
    setOfferViewed(false);
    setPopupOpen(false);
  });

  useEffect(() => {
    const secondsSinceLoad = (new Date() - loadedAt) / 1000;
    const onPageRequiredSeconds = offer?.onPageRequiredSeconds || 0;
    const isOnPageRequiredSeconds = secondsSinceLoad >= onPageRequiredSeconds;

    // Nothing to show if there is no offer or product.
    if (!offerId) {
      return;
    }

    // Abort if the offer was already viewed.
    if (offerViewed) {
      return;
    }

    // Abort if not on page required seconds.
    if (!isOnPageRequiredSeconds) {
      return;
    }

    // NOTE: Path (`triggerPagePath`) is tested in the API when querying for a random offer.
    // The page path (`pagePath`) is sent to the API via the useRandomOffer hook.

    openPopup();
  }, [offer, offerId, offerViewed, openPopup]);

  if (!offer || !shop) {
    return null;
  }

  return (
    <OfferPopup
      appRoot="#upselling-popup-root"
      open={!!offer && popupOpen}
      shop={shop}
      theme={popupTheme}
      offer={offer}
      offeredProducts={offeredProducts}
      onAddProduct={handleAddProduct}
      onClose={handleClosePopup}
    />
  );
};

PageLoadOffer.propTypes = {
  offer: PropTypes.object.isRequired,
  popupTheme: PropTypes.object.isRequired,
  offeredProducts: PropTypes.array.isRequired
};

export default PageLoadOffer;

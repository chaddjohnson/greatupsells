import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import { usePushStateListener } from '@neatowebsolutions/upselling-react-hooks';
import { useOfferTracking, useOfferAcceptance, useShop } from '../../hooks';

const loadedAt = new Date();

const PageLoadOffer = ({
  offer,
  popupTheme,
  triggerProduct,
  offeredProducts,
  shopifyCartSubtotal,
  shopifyCartItemCount,
  viewingOffer,
  onOpen,
  onClose
}) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [offerViewed, setOfferViewed] = useState(false);

  const { trackOfferImpression } = useOfferTracking();
  const { addProduct } = useOfferAcceptance();
  const { shop } = useShop();

  const offerId = offer?._id;

  const openPopup = useCallback(() => {
    const delay = (offer?.delaySeconds || 0) * 1000;

    setOfferViewed(true);
    onOpen();

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
  }, [offer, offerId, offeredProducts, trackOfferImpression, onOpen]);

  const handleClosePopup = () => {
    setPopupOpen(false);
    onClose();
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

    // Abort if another offer is open.
    if (viewingOffer) {
      return;
    }

    // NOTE: Path (`triggerPagePath`) is tested in the API when querying for a random offer.
    // The page path (`pagePath`) is sent to the API via the useRandomOffer hook.

    openPopup();
  }, [offer, offerId, offerViewed, openPopup, viewingOffer]);

  if (!offer || !shop) {
    return null;
  }

  return (
    <OfferPopup
      appRoot="#upselling-popup-root"
      open={popupOpen}
      shop={shop}
      theme={popupTheme}
      offer={offer}
      triggerProduct={triggerProduct}
      offeredProducts={offeredProducts}
      shopifyCartSubtotal={shopifyCartSubtotal}
      shopifyCartItemCount={shopifyCartItemCount}
      onAddProduct={addProduct}
      onClose={handleClosePopup}
    />
  );
};

PageLoadOffer.propTypes = {
  offer: PropTypes.object.isRequired,
  popupTheme: PropTypes.object.isRequired,
  triggerProduct: PropTypes.object,
  offeredProducts: PropTypes.array.isRequired,
  shopifyCartSubtotal: PropTypes.number,
  shopifyCartItemCount: PropTypes.number,
  viewingOffer: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func
};

PageLoadOffer.defaultProps = {
  viewingOffer: false,
  onOpen: () => {},
  onClose: () => {}
};

export default PageLoadOffer;

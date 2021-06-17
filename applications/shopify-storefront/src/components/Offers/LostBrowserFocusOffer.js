import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import {
  usePushStateListener,
  useDocumentVisibility
} from '@neatowebsolutions/upselling-react-hooks';
import { useOfferTracking, useOfferAcceptance, useShop } from '../../hooks';

const loadedAt = new Date();

const LostBrowserFocusOffer = ({
  offer,
  popupTheme,
  offeredProducts,
  viewingOffer,
  onOpen,
  onClose
}) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [offerViewed, setOfferViewed] = useState(false);

  const { trackOfferImpression } = useOfferTracking();
  const { handleAddProduct } = useOfferAcceptance();
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

  useDocumentVisibility((visible) => {
    // Only activate the popup when the browser becomes hidden.
    if (visible) {
      return;
    }

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

    openPopup();
  });

  // Listen to pushState events.
  usePushStateListener(() => {
    setOfferViewed(false);
    setPopupOpen(false);
  });

  if (!offer || !shop) {
    return null;
  }

  return (
    <OfferPopup
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

LostBrowserFocusOffer.propTypes = {
  offer: PropTypes.object.isRequired,
  popupTheme: PropTypes.object.isRequired,
  offeredProducts: PropTypes.array.isRequired,
  viewingOffer: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func
};

LostBrowserFocusOffer.defaultProps = {
  viewingOffer: false,
  onOpen: () => {},
  onClose: () => {}
};

export default LostBrowserFocusOffer;

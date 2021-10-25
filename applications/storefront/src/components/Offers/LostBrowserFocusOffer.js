import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { OfferPopup } from '@neatowebsolutions/greatupsells-react-components';
import {
  usePushStateListener,
  useDocumentVisibility
} from '@neatowebsolutions/greatupsells-react-hooks';
import { useOfferTracking, useOfferAcceptance, useShop } from '../../hooks';

let delayTimeout = 0;
let onPageRequiredSecondsTimeout = 0;

const LostBrowserFocusOffer = ({
  offer,
  popupTheme,
  triggerProduct,
  offeredProducts,
  shopifyCartItems,
  shopifyCartTotal,
  shopifyCartItemCount,
  viewingOffer,
  onOpen,
  onClose
}) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [offerViewed, setOfferViewed] = useState(false);
  const [delayFinished, setDelayFinished] = useState(false);
  const [isOnPageRequiredSeconds, setIsOnPageRequiredSeconds] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const { trackOfferImpression } = useOfferTracking();
  const { addProduct, replaceProduct } = useOfferAcceptance();
  const { shop } = useShop();

  const offerId = offer?._id;
  const delaySeconds = offer?.delaySeconds;
  const onPageRequiredSeconds = offer?.onPageRequiredSeconds;

  const openPopup = useCallback(() => {
    setOfferViewed(true);
    onOpen();

    const triggerShopifyProductId = triggerProduct?.shopifyProductId;
    const offeredShopifyProductIds = offeredProducts.map(
      ({ shopifyProductData }) => shopifyProductData?.id
    );

    setPopupOpen(true);

    trackOfferImpression({
      offerId,
      triggerShopifyProductId,
      offeredShopifyProductIds
    });
  }, [offerId, triggerProduct, offeredProducts, trackOfferImpression, onOpen]);

  const handleClosePopup = () => {
    setPopupOpen(false);
    onClose();
  };

  const tryOpeningPopup = useCallback(() => {
    // Nothing to show if there is no offer or product.
    if (!offerId) {
      return;
    }

    // Abort if there are no offered products.
    if (!offeredProducts?.length) {
      return;
    }

    // Abort if the offer was already viewed.
    if (offerViewed) {
      return;
    }

    // Only activate the popup when the browser becomes hidden.
    if (isVisible) {
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

    if (!delayFinished) {
      return;
    }

    openPopup();
  }, [
    offerId,
    offerViewed,
    offeredProducts,
    isVisible,
    openPopup,
    viewingOffer,
    isOnPageRequiredSeconds,
    delayFinished
  ]);

  useDocumentVisibility((visible) => {
    setIsVisible(visible);
    tryOpeningPopup();
  });

  // Listen to pushState events.
  usePushStateListener(() => {
    setOfferViewed(false);
    setPopupOpen(false);
    setIsOnPageRequiredSeconds(false);
    clearTimeout(delayTimeout);
    clearTimeout(onPageRequiredSecondsTimeout);
  });

  useEffect(() => {
    if (typeof delaySeconds === 'number') {
      if (delaySeconds > 0) {
        if (!delayTimeout) {
          delayTimeout = setTimeout(() => {
            setDelayFinished(true);
          }, delaySeconds * 1000);
        }
      } else {
        setDelayFinished(true);
      }
    }
  }, [delaySeconds]);

  useEffect(() => {
    if (typeof onPageRequiredSeconds === 'number') {
      if (onPageRequiredSeconds > 0) {
        if (!onPageRequiredSecondsTimeout) {
          // Wait the required number of seconds to show the offer
          onPageRequiredSecondsTimeout = setTimeout(() => {
            setIsOnPageRequiredSeconds(true);
            tryOpeningPopup();
          }, onPageRequiredSeconds * 1000);
        }
      } else {
        setIsOnPageRequiredSeconds(true);
      }
    }
  }, [onPageRequiredSeconds, tryOpeningPopup]);

  if (!offer || !shop) {
    return null;
  }

  return (
    <OfferPopup
      open={popupOpen}
      shop={shop}
      theme={popupTheme}
      offer={offer}
      triggerProduct={triggerProduct}
      offeredProducts={offeredProducts}
      shopifyCartItems={shopifyCartItems}
      shopifyCartTotal={shopifyCartTotal}
      shopifyCartItemCount={shopifyCartItemCount}
      onAddProduct={addProduct}
      onReplaceProduct={replaceProduct}
      onClose={handleClosePopup}
    />
  );
};

LostBrowserFocusOffer.propTypes = {
  offer: PropTypes.object.isRequired,
  popupTheme: PropTypes.object.isRequired,
  triggerProduct: PropTypes.object,
  offeredProducts: PropTypes.array.isRequired,
  shopifyCartItems: PropTypes.array,
  shopifyCartTotal: PropTypes.number,
  shopifyCartItemCount: PropTypes.number,
  viewingOffer: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func
};

LostBrowserFocusOffer.defaultProps = {
  shopifyCartItems: [],
  viewingOffer: false,
  onOpen: () => {},
  onClose: () => {}
};

export default LostBrowserFocusOffer;

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { OfferPopup } from '@greatupsellsreact-components';
import {
  usePushStateListener,
  useEventListener
} from '@greatupsellsreact-hooks';
import { useOfferTracking, useOfferAcceptance, useShop } from '../../hooks';

let onPageRequiredSecondsTimeout = 0;

const ExitIntentOffer = ({
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
  const [isOnPageRequiredSeconds, setIsOnPageRequiredSeconds] = useState(false);

  const { trackOfferImpression } = useOfferTracking();
  const { addProduct, replaceProduct } = useOfferAcceptance();
  const { shop } = useShop();

  const offerId = offer?._id;
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

  // References:
  //   - http://beeker.io/lab/exit-intent-popup/
  //   - https://stackoverflow.com/a/3187524/83897
  const handleMouseOut = useCallback(
    (event) => {
      event = event || window.event;

      // Nothing to show if there is no offer.
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

      // Abort if not on page required seconds.
      if (!isOnPageRequiredSeconds) {
        return;
      }

      // Abort if another offer is open.
      if (viewingOffer) {
        return;
      }

      // Works on mouse exiting window and user switching active program.
      const from = event.relatedTarget || event.toElement;

      // Get the current viewport width.
      const viewportWidth = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );

      const inputHasFocus = event.target.tagName.toLowerCase() === 'input';

      // Skip if focus is on an input field.
      if (inputHasFocus) {
        return;
      }

      // Skip if the current mouse X position is within 50px of the right edge of the viewport.
      if (event.clientX >= viewportWidth - 50) {
        return;
      }

      // Skip if the current mouse Y position is not within 50px of the top edge of the viewport.
      if (event.clientY >= 50) {
        return;
      }

      if (!from || from.nodeName === 'HTML') {
        openPopup();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      offer,
      offerId,
      offerViewed,
      openPopup,
      viewingOffer,
      offeredProducts,
      isOnPageRequiredSeconds
    ]
  );

  useEffect(() => {
    if (typeof onPageRequiredSeconds === 'number') {
      if (onPageRequiredSeconds > 0) {
        // Wait the required number of seconds to show the offer
        onPageRequiredSecondsTimeout = setTimeout(() => {
          setIsOnPageRequiredSeconds(true);
        }, onPageRequiredSeconds * 1000);
      } else {
        setIsOnPageRequiredSeconds(true);
      }
    }
  }, [onPageRequiredSeconds]);

  // Reference: https://stackoverflow.com/a/56858467/83897
  const getScrollDelta = useMemo(() => {
    let lastPosition;
    let newPosition;
    let timer;
    let delta;
    const delay = 50;

    return () => {
      newPosition = window.scrollY;

      if (typeof lastPosition !== 'undefined') {
        delta = newPosition - lastPosition;
      }

      lastPosition = newPosition;

      clearTimeout(timer);
      timer = setTimeout(() => {
        lastPosition = undefined;
        delta = 0;
      }, delay);

      return delta;
    };
  }, []);

  const handleScroll = useCallback(() => {
    // Nothing to show if there is no offer.
    if (!offerId) {
      return;
    }

    // Abort if the offer was already viewed.
    if (offerViewed) {
      return;
    }

    // Abort if screen is not mobile size.
    if (window.width >= 768) {
      return;
    }

    const scrollDelta = getScrollDelta();
    const thresholdDelta = -150;

    if (scrollDelta < thresholdDelta) {
      openPopup();
    }
  }, [offerId, offerViewed, getScrollDelta, openPopup]);

  // Listen for mouseout events.
  useEventListener('mouseout', handleMouseOut, true);

  // Listen for scroll events.
  useEventListener('scroll', handleScroll, true);

  // Listen to pushState events.
  usePushStateListener(() => {
    setOfferViewed(false);
    setPopupOpen(false);
    setIsOnPageRequiredSeconds(false);
    clearTimeout(onPageRequiredSecondsTimeout);
  });

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

ExitIntentOffer.propTypes = {
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

ExitIntentOffer.defaultProps = {
  shopifyCartItems: [],
  viewingOffer: false,
  onOpen: () => {},
  onClose: () => {}
};

export default ExitIntentOffer;

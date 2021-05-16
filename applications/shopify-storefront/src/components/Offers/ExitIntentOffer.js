import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import {
  usePushStateListener,
  useEventListener
} from '@neatowebsolutions/upselling-react-hooks';
import { useOfferTracking, useShop, useShopifyCart } from '../../hooks';

const loadedAt = new Date();

const ExitIntentOffer = ({ offer, popupTheme, offeredProducts }) => {
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
      await addProductToShopifyCart(shopifyVariantId, quantity);
    }

    // Accept the offer.
    await trackOfferAcceptance(
      offerId,
      shopifyProductId,
      shopifyVariantId,
      quantity
    );
  };

  // References:
  //   - http://beeker.io/lab/exit-intent-popup/
  //   - https://stackoverflow.com/a/3187524/83897
  const handleMouseOut = useCallback(
    (event) => {
      event = event || window.event;

      const secondsSinceLoad = (new Date() - loadedAt) / 1000;
      const onPageRequiredSeconds = offer?.onPageRequiredSeconds || 0;
      const isOnPageRequiredSeconds = secondsSinceLoad >= onPageRequiredSeconds;

      // Nothing to show if there is no offer.
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
    [offer, offerId, offeredProducts, offerViewed, trackOfferImpression] // eslint-disable-line react-hooks/exhaustive-deps
  );

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

ExitIntentOffer.propTypes = {
  offer: PropTypes.object.isRequired,
  popupTheme: PropTypes.object.isRequired,
  offeredProducts: PropTypes.array.isRequired
};

export default ExitIntentOffer;

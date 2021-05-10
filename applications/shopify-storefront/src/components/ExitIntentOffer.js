import React, { useState, useCallback, useMemo } from 'react';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import {
  usePushStateListener,
  useEventListener
} from '@neatowebsolutions/upselling-react-hooks';
import {
  useOfferTracking,
  useRandomOffer,
  useShop,
  useShopifyAjaxApi
} from '../hooks';

const triggerEvent = 'EXIT';

const ExitIntentOffer = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [offerViewed, setOfferViewed] = useState(false);

  const { addProductToShopifyCart } = useShopifyAjaxApi();
  const { trackOfferImpression, trackOfferAcceptance } = useOfferTracking();
  const { offer, popupTheme, offeredProducts } = useRandomOffer({
    event: triggerEvent,
    shouldQuery: true
  });
  const offerId = offer?._id;
  const { shop } = useShop();

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
    async (event) => {
      event = event || window.event;

      // Nothing to show if there is no offer.
      if (!offerId) {
        return;
      }

      // Abort if the offer was already viewed.
      if (offerViewed) {
        return;
      }

      const offeredShopifyProductIds = offeredProducts.map(
        ({ shopifyProductData }) => shopifyProductData?.id
      );
      const offeredShopifyVariantIds = offeredProducts.map(
        ({ shopifyProductData }) => shopifyProductData?.variants?.[0]?.id
      );

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
        setPopupOpen(true);
        setOfferViewed(true);

        await trackOfferImpression({
          offerId,
          offeredShopifyProductIds,
          offeredShopifyVariantIds
        });
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

  const handleScroll = useCallback(async () => {
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
    let offeredShopifyProductIds = null;
    let offeredShopifyVariantIds = null;

    if (scrollDelta < thresholdDelta) {
      offeredShopifyProductIds = offeredProducts.map(
        ({ shopifyProductData }) => shopifyProductData?.id
      );
      offeredShopifyVariantIds = offeredProducts.map(
        ({ shopifyProductData }) => shopifyProductData?.variants?.[0]?.id
      );

      setPopupOpen(true);
      setOfferViewed(true);

      await trackOfferImpression({
        offerId,
        offeredShopifyProductIds,
        offeredShopifyVariantIds
      });
    }
  }, [offer, offerId, offeredProducts, offerViewed, trackOfferImpression]); // eslint-disable-line react-hooks/exhaustive-deps

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
      onClose={() => setPopupOpen(false)}
    />
  );
};

export default ExitIntentOffer;

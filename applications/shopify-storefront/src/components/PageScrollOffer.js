import React, { useState, useCallback } from 'react';
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

const triggerEvent = 'SCROLL';

const PageScrollOffer = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [offerViewed, setOfferViewed] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(window.pageYOffset);

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

  const handleScroll = useCallback(async () => {
    // Reference: https://stackoverflow.com/a/31223774
    // Reference: https://javascript.info/size-and-scroll-window#width-height-of-the-document
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
    const windowHeight = window.innerHeight;
    const scrollPercentage = (scrollTop + windowHeight) / scrollHeight;
    const scrollingUp = lastScrollTop > scrollTop;

    setLastScrollTop(scrollTop);

    // Nothing to show if there is no offer or product.
    if (!offerId) {
      return;
    }

    // Abort if the offer was already viewed.
    if (offerViewed) {
      return;
    }

    // Ignore scroll up.
    if (scrollingUp) {
      return;
    }

    const defaultTriggerScrollThreshold = 75;
    const { triggerScrollThreshold = defaultTriggerScrollThreshold } = offer;
    let offeredShopifyProductIds = null;
    let offeredShopifyVariantIds = null;

    if (scrollPercentage >= triggerScrollThreshold / 100) {
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
  }, [offerId, offer, offeredProducts, offerViewed, trackOfferImpression]); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen to scroll events.
  useEventListener('scroll', handleScroll, true);

  // Listen to pushState events.
  usePushStateListener(() => {
    setOfferViewed(false);
    setPopupOpen(false);
    setLastScrollTop(0);
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

export default PageScrollOffer;

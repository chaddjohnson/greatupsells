import React, { useState, useEffect, useCallback } from 'react';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
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
  const { trackOfferView, trackOfferAcceptance } = useOfferTracking();
  const { offer, popupTheme, offeredProducts } = useRandomOffer({
    event: triggerEvent
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

      if (offer.triggerEvent !== 'EXIT') {
        return null;
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

        await trackOfferView({
          offerId,
          offeredShopifyProductIds,
          offeredShopifyVariantIds
        });
      }
    },
    [offer, offerId, offeredProducts, offerViewed, trackOfferView]
  );

  useEffect(() => {
    document.addEventListener('mouseout', handleMouseOut, true);

    return () => {
      document.removeEventListener('mouseout', handleMouseOut, true);
    };
  }, [handleMouseOut]);

  if (!offer || !shop) {
    return null;
  }

  if (offer.triggerEvent !== 'EXIT') {
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

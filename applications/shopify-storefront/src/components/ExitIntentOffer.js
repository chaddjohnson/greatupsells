import React, { useState, useEffect, useCallback } from 'react';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import { useOfferTracking, useRandomOffer, useShopifyAjaxApi } from '../hooks';

const triggerEvent = 'EXIT';

const ExitIntentOffer = () => {
  const [popupOpen, setPopupOpen] = useState(false);

  const { addProductToShopifyCart } = useShopifyAjaxApi();
  const { trackOfferView, trackOfferAcceptance } = useOfferTracking();
  const { offer, product, offerViewed } = useRandomOffer({
    event: triggerEvent
  });

  const handleAcceptance = async (
    shopifyProductId,
    shopifyVariantId,
    quantity
  ) => {
    // Accept the offer.
    await trackOfferAcceptance(
      offer._id,
      shopifyProductId,
      shopifyVariantId,
      quantity
    );

    // Add the product to the cart.
    if (shopifyVariantId) {
      await addProductToShopifyCart(shopifyVariantId, quantity);
    }

    // Close the popup.
    setPopupOpen(false);
  };

  // References:
  //   - http://beeker.io/lab/exit-intent-popup/
  //   - https://stackoverflow.com/a/3187524/83897
  const handleMouseOut = useCallback(
    async (event) => {
      event = event || window.event;

      // Nothing to show if there is no offer or product.
      if (!offer || !product) {
        return;
      }

      // Do not show the offer if one has already shown.
      if (offerViewed) {
        return;
      }

      const { shopifyProductData } = product;
      const shopifyProductId = shopifyProductData?.id;
      const shopifyVariantId = shopifyProductData?.variants?.[0]?.id;

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

        await trackOfferView(
          offer._id,
          triggerEvent,
          shopifyProductId,
          shopifyVariantId
        );
      }
    },
    [offer, product, offerViewed] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    document.addEventListener('mouseout', handleMouseOut, true);

    return () => {
      document.removeEventListener('mouseout', handleMouseOut, true);
    };
  }, [handleMouseOut]);

  return (
    <OfferPopup
      appRoot="#upselling-popup-root"
      open={!!offer && popupOpen}
      offer={offer}
      product={product}
      onAccept={handleAcceptance}
      onClose={() => setPopupOpen(false)}
    />
  );
};

export default ExitIntentOffer;

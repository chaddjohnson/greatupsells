import React, { useState, useEffect, useCallback } from 'react';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import {
  useOfferTracking,
  useRandomOffer
} from '@neatowebsolutions/upselling-react-hooks';
import { useShopifyAjaxApi } from '../hooks';

const ExitIntentOffer = () => {
  const [popupOpen, setPopupOpen] = useState(false);

  const { addProductToShopifyCart } = useShopifyAjaxApi();
  const { trackOfferView, trackOfferAcceptance } = useOfferTracking();
  const { offer } = useRandomOffer({
    event: 'EXIT',
    onSuccess: (offerData) => {
      const { _id: offerId, triggerEvent, product = {} } = offerData;
      const { shopifyProductData } = product;
      const productId = shopifyProductData?.id;
      const variantId = shopifyProductData?.variants?.[0]?.id;

      trackOfferView(offerId, triggerEvent, productId, variantId);
    }
  });

  const handleAcceptance = async (productId, variantId, quantity) => {
    // Accept the offer.
    await trackOfferAcceptance(productId, variantId, quantity);

    // Add the product to the cart.
    if (variantId) {
      await addProductToShopifyCart(variantId, quantity);
    }

    // Close the popup.
    setPopupOpen(false);
  };

  // Reference: http://beeker.io/lab/exit-intent-popup/, https://stackoverflow.com/a/3187524/83897
  const handleMouseOut = useCallback((event) => {
    event = event || window.event;

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
    }
  }, []);

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
      onAccept={handleAcceptance}
      onClose={() => setPopupOpen(false)}
    />
  );
};

export default ExitIntentOffer;

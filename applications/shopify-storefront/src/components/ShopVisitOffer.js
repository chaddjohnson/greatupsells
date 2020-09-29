import React, { useState } from 'react';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import {
  useOfferTracking,
  useRandomOffer
} from '@neatowebsolutions/upselling-react-hooks';
import { useShopifyAjaxApi } from '../hooks';

const ShopVisitOffer = () => {
  const [popupOpen, setPopupOpen] = useState(false);

  const { addProductToShopifyCart } = useShopifyAjaxApi();
  const { trackOfferView, trackOfferAcceptance } = useOfferTracking();
  const { offer } = useRandomOffer({
    event: 'LOAD',
    onSuccess: (offerData) => {
      const { _id: offerId, triggerEvent, product = {} } = offerData;
      const { shopifyProductData } = product;
      const productId = shopifyProductData?.id;
      const variantId = shopifyProductData?.variants?.[0]?.id;

      setPopupOpen(true);

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

export default ShopVisitOffer;

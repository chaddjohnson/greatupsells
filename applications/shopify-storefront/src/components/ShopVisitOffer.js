import React, { useState, useEffect } from 'react';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import {
  useOfferTracking,
  useRandomOffer
} from '@neatowebsolutions/upselling-react-hooks';
import { useShopifyAjaxApi } from '../hooks';

const triggerEvent = 'LOAD';

const ShopVisitOffer = () => {
  const [popupOpen, setPopupOpen] = useState(false);

  const { addProductToShopifyCart } = useShopifyAjaxApi();
  const { trackOfferView, trackOfferAcceptance } = useOfferTracking();
  const { offer, product } = useRandomOffer({ event: triggerEvent });

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
      await addProductToShopifyCart(shopifyProductId, quantity);
    }

    // Close the popup.
    setPopupOpen(false);
  };

  useEffect(() => {
    if (!offer || !product) {
      return;
    }

    const { shopifyProductData } = product;
    const shopifyProductId = shopifyProductData?.id;
    const shopifyVariantId = shopifyProductData?.variants?.[0]?.id;

    (async () => {
      setPopupOpen(true);

      await trackOfferView(
        offer._id,
        triggerEvent,
        shopifyProductId,
        shopifyVariantId
      );
    })();
  }, [offer, product]); // eslint-disable-line react-hooks/exhaustive-deps

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

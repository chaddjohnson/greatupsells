import React, { useState, useEffect } from 'react';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import { useOfferTracking, useRandomOffer, useShopifyAjaxApi } from '../hooks';

const triggerEvent = 'LOAD';

const ShopVisitOffer = () => {
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
      await addProductToShopifyCart(shopifyProductId, quantity);
    }

    // Close the popup.
    setPopupOpen(false);
  };

  useEffect(() => {
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

    (async () => {
      setPopupOpen(true);

      await trackOfferView(
        offer._id,
        triggerEvent,
        shopifyProductId,
        shopifyVariantId
      );
    })();
  }, [offer, product, offerViewed]); // eslint-disable-line react-hooks/exhaustive-deps

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

export default ShopVisitOffer;

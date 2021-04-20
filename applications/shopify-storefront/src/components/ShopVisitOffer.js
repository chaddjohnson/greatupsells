import React, { useState, useEffect } from 'react';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import {
  useOfferTracking,
  useRandomOffer,
  useShop,
  useShopifyAjaxApi
} from '../hooks';

const triggerEvent = 'LOAD';

const ShopVisitOffer = () => {
  const [popupOpen, setPopupOpen] = useState(false);

  const { addProductToShopifyCart } = useShopifyAjaxApi();
  const { trackOfferView, trackOfferAcceptance } = useOfferTracking();
  const { offer, offeredProducts, offerViewed } = useRandomOffer({
    event: triggerEvent
  });
  const { shop } = useShop();

  const handleAddProduct = async (
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
  };

  useEffect(() => {
    // Nothing to show if there is no offer or product.
    if (!offer) {
      return;
    }

    // Do not show the offer if one has already shown.
    if (offerViewed) {
      return;
    }

    const offeredShopifyProductIds = offeredProducts.map(
      ({ shopifyProductData }) => shopifyProductData?.id
    );
    const offeredShopifyVariantIds = offeredProducts.map(
      ({ shopifyProductData }) => shopifyProductData?.variants?.[0]?.id
    );

    (async () => {
      setPopupOpen(true);

      await trackOfferView(
        offer._id,
        triggerEvent,
        offeredShopifyProductIds,
        offeredShopifyVariantIds
      );
    })();
  }, [offer, offeredProducts, offerViewed]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!offer || !shop) {
    return null;
  }

  return (
    <OfferPopup
      appRoot="#upselling-popup-root"
      open={!!offer && popupOpen}
      shop={shop}
      theme={offer.popupTheme}
      offer={offer}
      offeredProducts={offeredProducts}
      onAddProduct={handleAddProduct}
      onClose={() => setPopupOpen(false)}
    />
  );
};

export default ShopVisitOffer;

import React, { useState, useEffect } from 'react';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import { usePushStateListener } from '@neatowebsolutions/upselling-react-hooks';
import {
  useOfferTracking,
  useRandomOffer,
  useShop,
  useShopifyAjaxApi,
  useShopifyCartProductAddListener
} from '../hooks';

const triggerEvent = 'ADD';

const ProductOffer = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [offerViewed, setOfferViewed] = useState(false);
  const [shopifyProductIds, setShopifyProductIds] = useState([]);

  const { addProductToShopifyCart } = useShopifyAjaxApi();
  const { trackOfferImpression, trackOfferAcceptance } = useOfferTracking();
  const { offer, popupTheme, triggerProduct, offeredProducts } = useRandomOffer(
    {
      event: triggerEvent,
      shopifyProductIds
    }
  );
  const offerId = offer?._id;
  const { shop } = useShop();

  const handleClosePopup = () => {
    setPopupOpen(false);
    setShopifyProductIds([]);
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

  useEffect(() => {
    // Nothing to show if there is no offer or product.
    if (!offerId) {
      return;
    }

    if (offer.triggerEvent !== 'ADD') {
      return null;
    }

    // Abort if the offer was already viewed.
    if (offerViewed) {
      return;
    }

    const triggerShopifyProductId = triggerProduct.shopifyProductId;
    const offeredShopifyProductIds = offeredProducts.map(
      ({ shopifyProductData }) => shopifyProductData?.id
    );
    const offeredShopifyVariantIds = offeredProducts.map(
      ({ shopifyProductData }) => shopifyProductData?.variants?.[0]?.id
    );

    (async () => {
      setPopupOpen(true);
      setOfferViewed(true);

      await trackOfferImpression({
        offerId,
        triggerShopifyProductId,
        offeredShopifyProductIds,
        offeredShopifyVariantIds
      });
    })();
  }, [
    offerId,
    offer,
    triggerProduct,
    offeredProducts,
    offerViewed,
    trackOfferImpression
  ]);

  // Subscribe to product add events.
  useShopifyCartProductAddListener((addedProduct) => {
    if (addedProduct?.product_id) {
      setShopifyProductIds([addedProduct.product_id]);
    }
  });

  // Listen to pushState events.
  usePushStateListener(() => {
    setOfferViewed(false);
    setPopupOpen(false);
    setShopifyProductIds([]);
  });

  if (!offer || !shop) {
    return null;
  }

  if (offer.triggerEvent !== 'ADD') {
    return null;
  }

  return (
    <OfferPopup
      appRoot="#upselling-popup-root"
      open={!!offer && popupOpen}
      shop={shop}
      theme={popupTheme}
      offer={offer}
      triggerProduct={triggerProduct}
      offeredProducts={offeredProducts}
      onAddProduct={handleAddProduct}
      onClose={handleClosePopup}
    />
  );
};

export default ProductOffer;

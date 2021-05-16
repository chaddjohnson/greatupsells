import React, { useState, useCallback, useEffect } from 'react';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import { usePushStateListener } from '@neatowebsolutions/upselling-react-hooks';
import {
  useOfferTracking,
  useRandomOffers,
  useShop,
  useShopifyCart,
  useShopifyCartProductAddListener
} from '../../hooks';

const triggerEvent = 'ADD';
const loadedAt = new Date();

const ProductOffer = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [offerViewed, setOfferViewed] = useState(false);
  const [shopifyProductIds, setShopifyProductIds] = useState([]);
  const [productAdded, setProductAdded] = useState(false);

  const { addProductToShopifyCart } = useShopifyCart();
  const { trackOfferImpression, trackOfferAcceptance } = useOfferTracking();
  const { offersData: offerData = [] } = useRandomOffers({
    events: [triggerEvent],
    shopifyProductIds,
    shouldQuery: productAdded && !!setShopifyProductIds?.length
  });

  const { offer, popupTheme, triggerProduct, offeredProducts } =
    offerData?.[0] || {};
  const offerId = offer?._id;
  const { shop } = useShop();

  const openPopup = useCallback(() => {
    const delay = (offer?.delaySeconds || 0) * 1000;

    setOfferViewed(true);

    setTimeout(async () => {
      const triggerShopifyProductId = triggerProduct.shopifyProductId;
      const offeredShopifyProductIds = offeredProducts.map(
        ({ shopifyProductData }) => shopifyProductData?.id
      );
      const offeredShopifyVariantIds = offeredProducts.map(
        ({ shopifyProductData }) => shopifyProductData?.variants?.[0]?.id
      );

      setPopupOpen(true);

      await trackOfferImpression({
        offerId,
        triggerShopifyProductId,
        offeredShopifyProductIds,
        offeredShopifyVariantIds
      });
    }, delay);
  }, [offer, offerId, triggerProduct, offeredProducts, trackOfferImpression]);

  const handleClosePopup = () => {
    setPopupOpen(false);
    setShopifyProductIds([]);
    setProductAdded(false);
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
    const secondsSinceLoad = (new Date() - loadedAt) / 1000;
    const onPageRequiredSeconds = offer?.onPageRequiredSeconds || 0;
    const isOnPageRequiredSeconds = secondsSinceLoad >= onPageRequiredSeconds;

    // Nothing to show if there is no offer or product.
    if (!offerId) {
      return;
    }

    // Abort if the offer was already viewed.
    if (offerViewed) {
      return;
    }

    // Abort if not on page required seconds.
    if (!isOnPageRequiredSeconds) {
      return;
    }

    openPopup();
  }, [offer, offerId, offerViewed, openPopup]);

  // Subscribe to product add events.
  useShopifyCartProductAddListener((addedProduct) => {
    if (addedProduct?.product_id) {
      setShopifyProductIds([addedProduct.product_id]);
      setProductAdded(true);
    }
  });

  // Listen to pushState events.
  usePushStateListener(() => {
    setOfferViewed(false);
    setPopupOpen(false);
    setShopifyProductIds([]);
    setProductAdded(false);
  });

  if (!offer || !shop) {
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

import React, { useState, useCallback, useEffect } from 'react';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import { usePushStateListener } from '@neatowebsolutions/upselling-react-hooks';
import {
  useOfferTracking,
  useRandomOffer,
  useShop,
  useShopifyAjaxApi
} from '../hooks';

const triggerEvent = 'CART';
const loadedAt = new Date();

const CartOffer = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [offerViewed, setOfferViewed] = useState(false);
  const [shopifyProductIds, setShopifyProductIds] = useState([]);
  const [cartQueried, setCartQueried] = useState(false);

  const { fetchShopifyCart, addProductToShopifyCart } = useShopifyAjaxApi();
  const { trackOfferImpression, trackOfferAcceptance } = useOfferTracking();
  const { offer, popupTheme, triggerProduct, offeredProducts } = useRandomOffer(
    {
      event: triggerEvent,
      shopifyProductIds,
      shouldQuery: cartQueried && window.location.pathname === '/cart'
    }
  );
  const offerId = offer?._id;
  const { shop } = useShop();

  const openPopup = useCallback(() => {
    const delay = (offer?.delaySeconds || 0) * 1000;

    setOfferViewed(true);

    setTimeout(async () => {
      const triggerShopifyProductId = triggerProduct?.shopifyProductId;
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
    setCartQueried(false);
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

  useEffect(() => {
    const path = window.location.pathname;
    const isCartPage = path === '/cart';

    if (!isCartPage) {
      return;
    }

    (async () => {
      const { items } = await fetchShopifyCart();

      setShopifyProductIds(items.map((item) => item.product_id));
      setCartQueried(true);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen to pushState events.
  usePushStateListener(async () => {
    setOfferViewed(false);
    setPopupOpen(false);
    setShopifyProductIds([]);
    setCartQueried(false);

    const { items } = await fetchShopifyCart();

    setShopifyProductIds(items.map((item) => item.product_id));
    setCartQueried(true);
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

export default CartOffer;

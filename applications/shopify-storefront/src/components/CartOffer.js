import React, { useState, useEffect } from 'react';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import {
  useOfferTracking,
  useRandomOffer,
  useShop,
  useShopifyAjaxApi
} from '../hooks';

const triggerEvent = 'CART';

const CartOffer = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [offerViewed, setOfferViewed] = useState(false);
  const [shopifyProductIds, setShopifyProductIds] = useState([]);

  const { fetchShopifyCart, addProductToShopifyCart } = useShopifyAjaxApi();
  const { trackOfferView, trackOfferAcceptance } = useOfferTracking();
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
    await trackOfferAcceptance({
      offerId,
      shopifyProductId,
      shopifyVariantId,
      quantity
    });
  };

  useEffect(() => {
    // Nothing to show if there is no offer or product.
    if (!offerId) {
      return;
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

      await trackOfferView({
        offerId,
        triggerShopifyProductId,
        offeredShopifyProductIds,
        offeredShopifyVariantIds
      });
    })();
  }, [offerId, triggerProduct, offeredProducts, offerViewed, trackOfferView]);

  // TODO: Watch for location change events; see https://stackoverflow.com/a/58099300/83897.

  useEffect(() => {
    const path = window.location.pathname;
    const isCartPage = path === '/cart';

    if (!isCartPage) {
      return;
    }

    (async () => {
      const { items } = await fetchShopifyCart();

      setShopifyProductIds(items.map((item) => item.product_id));
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

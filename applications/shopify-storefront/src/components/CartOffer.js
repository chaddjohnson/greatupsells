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
  const [shopifyProductIds, setShopifyProductIds] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);

  const { fetchShopifyCart, addProductToShopifyCart } = useShopifyAjaxApi();
  const { trackOfferView, trackOfferAcceptance } = useOfferTracking();
  const {
    offer,
    triggerProduct,
    offeredProducts,
    offerViewed
  } = useRandomOffer({
    event: triggerEvent,
    shopifyProductIds
  });
  const { shop } = useShop();

  const handleClosePopup = () => {
    setPopupOpen(false);
    setShopifyProductIds([]);
  };

  const handleAddProduct = async (productId, variantId, quantity) => {
    // Accept the offer.
    await trackOfferAcceptance(offer._id, productId, variantId, quantity);

    // Add the product to the cart.
    if (variantId) {
      await addProductToShopifyCart(variantId, quantity);
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

    const triggerShopifyProductId = triggerProduct.shopifyProductId;
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
        triggerShopifyProductId,
        offeredShopifyProductIds,
        offeredShopifyVariantIds
      );
    })();
  }, [offer, offeredProducts, offerViewed]); // eslint-disable-line react-hooks/exhaustive-deps

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
      theme={offer.popupTheme}
      offer={offer}
      triggerProduct={triggerProduct}
      offeredProducts={offeredProducts}
      onAddProduct={handleAddProduct}
      onClose={handleClosePopup}
    />
  );
};

export default CartOffer;

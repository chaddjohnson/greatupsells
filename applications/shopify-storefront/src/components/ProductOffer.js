import React, { useState, useEffect } from 'react';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import { useOfferTracking, useRandomOffer, useShopifyAjaxApi } from '../hooks';

const triggerEvent = 'ADD';

const ProductOffer = () => {
  const [shopifyProductIds, setShopifyProductIds] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);

  const {
    addProductToShopifyCart,
    onProductAddedToShopifyCart
  } = useShopifyAjaxApi();
  const { trackOfferView, trackOfferAcceptance } = useOfferTracking();
  const { offer, offeredProducts, offerViewed } = useRandomOffer({
    event: triggerEvent,
    shopifyProductIds
  });

  const handleClosePopup = () => {
    setPopupOpen(false);
    setShopifyProductIds([]);
  };

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
      await addProductToShopifyCart(shopifyVariantId, quantity);
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

  // Subscribe to product add events.
  useEffect(() => {
    return onProductAddedToShopifyCart((addedProduct) => {
      if (addedProduct?.product_id) {
        setShopifyProductIds([addedProduct.product_id]);
      }
    });
  }, [onProductAddedToShopifyCart]);

  if (!offer) {
    return null;
  }

  return (
    <OfferPopup
      appRoot="#upselling-popup-root"
      open={!!offer && popupOpen}
      theme={offer.popupTheme}
      offer={offer}
      triggerProduct={{}}
      offeredProducts={offeredProducts}
      onAddProduct={handleAddProduct}
      onClose={handleClosePopup}
    />
  );
};

export default ProductOffer;

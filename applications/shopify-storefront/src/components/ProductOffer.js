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
  const { offer, product, offerViewed } = useRandomOffer({
    event: triggerEvent,
    shopifyProductIds
  });

  const handleClosePopup = () => {
    setPopupOpen(false);
    setShopifyProductIds([]);
  };

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
      await addProductToShopifyCart(shopifyVariantId, quantity);
    }

    // Close the popup.
    handleClosePopup();
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

  // Subscribe to product add events.
  useEffect(() => {
    return onProductAddedToShopifyCart((addedProduct) => {
      if (addedProduct?.product_id) {
        setShopifyProductIds([addedProduct.product_id]);
      }
    });
  }, [onProductAddedToShopifyCart]);

  return (
    <OfferPopup
      appRoot="#upselling-popup-root"
      open={!!offer && popupOpen}
      offer={offer}
      product={product}
      onAccept={handleAcceptance}
      onClose={handleClosePopup}
    />
  );
};

export default ProductOffer;

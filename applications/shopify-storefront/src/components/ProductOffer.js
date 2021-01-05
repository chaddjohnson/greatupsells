import React, { useState, useEffect } from 'react';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import {
  useOfferTracking,
  useRandomOffer,
  useRandomProduct,
  useShopifyAjaxApi
} from '../hooks';

const triggerEvent = 'ADD';

const ProductOffer = () => {
  const [productIds, setProductIds] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);

  const { addProductToShopifyCart } = useShopifyAjaxApi();
  const { trackOfferView, trackOfferAcceptance } = useOfferTracking();
  const { offer } = useRandomOffer({
    event: triggerEvent,
    productIds
  });
  const { product } = useRandomProduct({ offer });

  const handleClosePopup = () => {
    setPopupOpen(false);
    setProductIds([]);
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

  useEffect(() => {
    const originalOpen = window.XMLHttpRequest.prototype.open;

    window.XMLHttpRequest.prototype.open = function (method, url, ...params) {
      const request = this;

      // Intercept Shopify's add to cart event.
      if (url === '/cart/add.js') {
        request.addEventListener('load', () => {
          const addedProduct = JSON.parse(request?.responseText || {});

          if (addedProduct?.id) {
            setProductIds([addedProduct.id]);
          }
        });
      }

      return originalOpen.apply(this, [method, url, ...params]);
    };

    return () => {
      window.XMLHttpRequest.prototype.open = originalOpen;
    };
  }, []);

  return (
    <OfferPopup
      appRoot="#upselling-popup-root"
      open={!!offer && popupOpen}
      offer={offer}
      product={offer?.product}
      onAccept={handleAcceptance}
      onClose={handleClosePopup}
    />
  );
};

export default ProductOffer;

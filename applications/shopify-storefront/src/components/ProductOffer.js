import React, { useState, useEffect } from 'react';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import {
  useOfferTracking,
  useRandomOffer
} from '@neatowebsolutions/upselling-react-hooks';
import { useShopifyAjaxApi } from '../hooks';

const ProductOffer = () => {
  const [productIds, setProductIds] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);

  const { addProductToShopifyCart } = useShopifyAjaxApi();
  const { trackOfferView, trackOfferAcceptance } = useOfferTracking();
  const { offer } = useRandomOffer({
    event: 'ADD',
    productIds,
    onSuccess: async (offerData) => {
      const { _id: offerId, triggerEvent, product = {} } = offerData;
      const { shopifyProductData } = product;
      const productId = shopifyProductData?.id;
      const variantId = shopifyProductData?.variants?.[0]?.id;

      await trackOfferView(offerId, triggerEvent, productId, variantId);

      setPopupOpen(true);
    }
  });

  const handleClosePopup = () => {
    setPopupOpen(false);
    setProductIds([]);
  };

  const handleAcceptance = async (productId, variantId, quantity) => {
    // Accept the offer.
    await trackOfferAcceptance(productId, variantId, quantity);

    // Add the product to the cart.
    if (variantId) {
      await addProductToShopifyCart(variantId, quantity);
    }

    // Close the popup.
    handleClosePopup();
  };

  useEffect(() => {
    const originalOpen = window.XMLHttpRequest.prototype.open;

    window.XMLHttpRequest.prototype.open = function (method, url, ...params) {
      const request = this;

      // Intercept Shopify's add to cart event.
      if (url === '/cart/add.js') {
        request.addEventListener('load', () => {
          const product = JSON.parse(request?.responseText || {});

          if (product?.id) {
            setProductIds([product.id]);
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

import React, { useState, useEffect } from 'react';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import {
  useOfferTracking,
  useRandomOffer
} from '@neatowebsolutions/upselling-react-hooks';
import { useShopifyAjaxApi } from '../hooks';

const CheckoutOffer = () => {
  const [productIds, setProductIds] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);

  const { fetchShopifyCart, addProductToShopifyCart } = useShopifyAjaxApi();
  const { trackOfferView, trackOfferAcceptance } = useOfferTracking();
  const { offer, product } = useRandomOffer({
    event: 'CHECKOUT',
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
    await trackOfferAcceptance(offer._id, productId, variantId, quantity);

    // Add the product to the cart.
    if (variantId) {
      await addProductToShopifyCart(variantId, quantity);
    }

    // Close the popup.
    handleClosePopup();
  };

  // TODO: Watch for location change events; see https://stackoverflow.com/a/58099300/83897.

  useEffect(() => {
    const path = window.location.pathname;
    const isCheckoutPage = path.indexOf('/checkouts') > -1;

    if (!isCheckoutPage) {
      return;
    }

    (async () => {
      const { items } = await fetchShopifyCart();

      setProductIds(items.map(({ id }) => id));
    })();
  }, [fetchShopifyCart]);

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

export default CheckoutOffer;

import React, { useState, useEffect } from 'react';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import { useOfferTracking, useRandomOffer, useShopifyAjaxApi } from '../hooks';

const triggerEvent = 'CHECKOUT';

const CheckoutOffer = () => {
  const [shopifyProductIds, setShopifyProductIds] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);

  const { fetchShopifyCart, addProductToShopifyCart } = useShopifyAjaxApi();
  const { trackOfferView, trackOfferAcceptance } = useOfferTracking();
  const { offer, product } = useRandomOffer({
    event: triggerEvent,
    shopifyProductIds
  });

  const handleClosePopup = () => {
    setPopupOpen(false);
    setShopifyProductIds([]);
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

  // TODO: Watch for location change events; see https://stackoverflow.com/a/58099300/83897.

  useEffect(() => {
    const path = window.location.pathname;
    const isCheckoutPage = path.indexOf('/checkouts') > -1;

    if (!isCheckoutPage) {
      return;
    }

    (async () => {
      const { items } = await fetchShopifyCart();

      setShopifyProductIds(items.map((item) => item.product_id));
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

export default CheckoutOffer;

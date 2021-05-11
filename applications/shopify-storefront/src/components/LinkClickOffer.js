import React, { useState, useCallback } from 'react';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import {
  usePushStateListener,
  useEventListener
} from '@neatowebsolutions/upselling-react-hooks';
import {
  useOfferTracking,
  useRandomOffer,
  useShop,
  useShopifyAjaxApi
} from '../hooks';

// IE9+ polyfill for `.closest()`.
// Source: https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#polyfill
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    let el = this;

    do {
      if (Element.prototype.matches.call(el, s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

const triggerEvent = 'LINK';

const LinkClickOffer = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [offerViewed, setOfferViewed] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const { addProductToShopifyCart } = useShopifyAjaxApi();
  const { trackOfferImpression, trackOfferAcceptance } = useOfferTracking();
  const { offer, popupTheme, offeredProducts } = useRandomOffer({
    event: triggerEvent,
    shouldQuery: true
  });
  const offerId = offer?._id;
  const { shop } = useShop();

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

  const handleLinkClick = useCallback(
    async (event) => {
      // Nothing to show if there is no offer or product.
      if (!offerId) {
        return;
      }

      // Abort if the offer was already viewed.
      if (offerViewed) {
        return;
      }

      let target = event.target || event.srcElement;
      let href = '';
      let offeredShopifyProductIds = null;
      let offeredShopifyVariantIds = null;

      // Account for elements nested within links.
      if (target.tagName.toLowerCase() !== 'a') {
        target = target.closest('a');
      }

      // Ensure the element is a link.
      if (target.tagName.toLowerCase() !== 'a') {
        return;
      }

      href = target.getAttribute('href');

      // Ignore links without `href` attribute as well as hash links.
      if (!href || href.substring(0, 1) === '#') {
        return;
      }

      // Prevent the link from redirecting to the target URL.
      event.preventDefault();

      // Track the URL for the clicked link.
      setLinkUrl(href);

      offeredShopifyProductIds = offeredProducts.map(
        ({ shopifyProductData }) => shopifyProductData?.id
      );
      offeredShopifyVariantIds = offeredProducts.map(
        ({ shopifyProductData }) => shopifyProductData?.variants?.[0]?.id
      );

      setPopupOpen(true);
      setOfferViewed(true);

      await trackOfferImpression({
        offerId,
        offeredShopifyProductIds,
        offeredShopifyVariantIds
      });
    },
    [offerId, offer, offeredProducts, offerViewed, trackOfferImpression] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleClose = () => {
    setPopupOpen(false);

    // Redirect to the original target URL after closing the popup.
    if (linkUrl) {
      window.location.href = linkUrl;
    }
  };

  useEventListener('click', handleLinkClick);

  // Listen to pushState events.
  usePushStateListener(() => {
    setOfferViewed(false);
    setPopupOpen(false);
    setLinkUrl('');
  });

  if (!offer || !shop) {
    return null;
  }

  return (
    <OfferPopup
      open={!!offer && popupOpen}
      shop={shop}
      theme={popupTheme}
      offer={offer}
      offeredProducts={offeredProducts}
      onAddProduct={handleAddProduct}
      onClose={handleClose}
    />
  );
};

export default LinkClickOffer;

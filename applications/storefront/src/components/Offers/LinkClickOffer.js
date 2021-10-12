import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import {
  usePushStateListener,
  useEventListener
} from '@neatowebsolutions/upselling-react-hooks';
import { useOfferTracking, useOfferAcceptance, useShop } from '../../hooks';

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

let delayTimeout = 0;
let onPageRequiredSecondsTimeout = 0;

const LinkClickOffer = ({
  offer,
  popupTheme,
  triggerProduct,
  offeredProducts,
  shopifyCartItems,
  shopifyCartTotal,
  shopifyCartItemCount,
  viewingOffer,
  onOpen,
  onClose
}) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [offerViewed, setOfferViewed] = useState(false);
  const [isOnPageRequiredSeconds, setIsOnPageRequiredSeconds] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [openLinkInNewWindow, setOpenLinkInNewWindow] = useState(false);

  const { trackOfferImpression } = useOfferTracking();
  const { addProduct, replaceProduct } = useOfferAcceptance();
  const { shop } = useShop();

  const offerId = offer?._id;
  const onPageRequiredSeconds = offer?.onPageRequiredSeconds;

  const openPopup = useCallback(() => {
    const delay = (offer?.delaySeconds || 0) * 1000;

    setOfferViewed(true);
    onOpen();

    if (!delayTimeout) {
      delayTimeout = setTimeout(async () => {
        const triggerShopifyProductId = triggerProduct?.shopifyProductId;
        const offeredShopifyProductIds = offeredProducts.map(
          ({ shopifyProductData }) => shopifyProductData?.id
        );

        setPopupOpen(true);

        await trackOfferImpression({
          offerId,
          triggerShopifyProductId,
          offeredShopifyProductIds
        });
      }, delay);
    }
  }, [
    offer,
    offerId,
    triggerProduct,
    offeredProducts,
    trackOfferImpression,
    onOpen
  ]);

  const handleLinkClick = useCallback(
    (event) => {
      event = event || window.event;
      // Nothing to show if there is no offer or product.
      if (!offerId) {
        return;
      }

      // Abort if there are no offered products.
      if (!offeredProducts?.length) {
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

      // Abort if another offer is open.
      if (viewingOffer) {
        return;
      }

      let target = event.target || event.srcElement;
      let href = '';
      let isExternal = false;

      // Account for elements nested within links.
      if (target.tagName.toLowerCase() !== 'a') {
        target = target.closest('a');
      }

      // Ensure the element is a link.
      if (target.tagName.toLowerCase() !== 'a') {
        return;
      }

      href = target.getAttribute('href');
      isExternal = target.getAttribute('target') === '_blank';

      // Ignore links without `href` attribute as well as hash links.
      if (!href || href.substring(0, 1) === '#') {
        return;
      }

      // Limit to external links if the offer is configured as such.
      if (offer.triggerExternalLinksOnly && !href.match(/^https?:\/\//)) {
        return;
      }

      // Prevent the link from redirecting to the target URL.
      event.preventDefault();

      // Track the URL for the clicked link.
      setLinkUrl(href);
      setOpenLinkInNewWindow(isExternal);

      // Finally, open the popup.
      openPopup();
    },
    [
      offer,
      offerId,
      offerViewed,
      openPopup,
      viewingOffer,
      offeredProducts,
      isOnPageRequiredSeconds
    ]
  );

  const handleClosePopup = () => {
    let newWindow = null;

    setPopupOpen(false);
    onClose();

    // Redirect to the original link URL after closing the popup.
    if (linkUrl && !openLinkInNewWindow) {
      window.location.href = linkUrl;
    }

    // Open a new window/tab to the original link URL after closing the popup if the link target is a new window.
    if (linkUrl && openLinkInNewWindow) {
      newWindow = window.open(linkUrl);

      // Redirect to the link URL if the popup was blocked.
      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed === 'undefined'
      ) {
        window.location.href = linkUrl;
      }
    }
  };

  useEventListener('click', handleLinkClick);

  // Listen to pushState events.
  usePushStateListener(() => {
    setOfferViewed(false);
    setPopupOpen(false);
    setIsOnPageRequiredSeconds(false);
    setLinkUrl('');
    setOpenLinkInNewWindow(false);
    clearTimeout(delayTimeout);
    clearTimeout(onPageRequiredSecondsTimeout);
  });

  useEffect(() => {
    if (typeof onPageRequiredSeconds === 'number') {
      if (onPageRequiredSeconds > 0) {
        // Wait the required number of seconds to show the offer
        onPageRequiredSecondsTimeout = setTimeout(() => {
          setIsOnPageRequiredSeconds(true);
        }, onPageRequiredSeconds * 1000);
      } else {
        setIsOnPageRequiredSeconds(true);
      }
    }
  }, [onPageRequiredSeconds]);

  if (!offer || !shop) {
    return null;
  }

  return (
    <OfferPopup
      open={popupOpen}
      shop={shop}
      theme={popupTheme}
      offer={offer}
      triggerProduct={triggerProduct}
      offeredProducts={offeredProducts}
      shopifyCartItems={shopifyCartItems}
      shopifyCartTotal={shopifyCartTotal}
      shopifyCartItemCount={shopifyCartItemCount}
      onAddProduct={addProduct}
      onReplaceProduct={replaceProduct}
      onClose={handleClosePopup}
    />
  );
};

LinkClickOffer.propTypes = {
  offer: PropTypes.object.isRequired,
  popupTheme: PropTypes.object.isRequired,
  triggerProduct: PropTypes.object,
  offeredProducts: PropTypes.array.isRequired,
  shopifyCartItems: PropTypes.array,
  shopifyCartTotal: PropTypes.number,
  shopifyCartItemCount: PropTypes.number,
  viewingOffer: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func
};

LinkClickOffer.defaultProps = {
  shopifyCartItems: [],
  viewingOffer: false,
  onOpen: () => {},
  onClose: () => {}
};

export default LinkClickOffer;

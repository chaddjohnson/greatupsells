import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { OfferPopup } from '@greatupsells/react-components';
import {
  usePushStateListener,
  useEventListener
} from '@greatupsells/react-hooks';
import {
  useOfferTracking,
  useOfferAcceptance,
  useShopifyCart
} from '../../hooks';

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

let onPageRequiredSecondsTimeout = 0;

const LinkClickOffer = ({
  shop,
  offer,
  theme,
  ThemeComponent,
  locale,
  countryCode,
  currency,
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
  const { addProducts, replaceProduct } = useOfferAcceptance();
  const { findTriggerProductShopifyVariantId } = useShopifyCart();

  const offerId = offer?._id;
  const onPageRequiredSeconds = offer?.onPageRequiredSeconds || 0;

  const openPopup = useCallback(() => {
    setOfferViewed(true);
    onOpen();

    const triggerShopifyProductId = triggerProduct?.shopifyProductId;
    const triggerShopifyVariantId = findTriggerProductShopifyVariantId(
      triggerProduct
    );
    const offeredShopifyProductIds = offeredProducts.map(
      ({ shopifyProductData }) => shopifyProductData?.id
    );

    setPopupOpen(true);

    trackOfferImpression({
      offerId,
      triggerShopifyProductId,
      triggerShopifyVariantId,
      offeredShopifyProductIds
    });
  }, [
    onOpen,
    triggerProduct,
    offeredProducts,
    findTriggerProductShopifyVariantId,
    trackOfferImpression,
    offerId
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

    clearTimeout(onPageRequiredSecondsTimeout);
  });

  useEffect(() => {
    if (!offerId) {
      return;
    }

    // Wait the required number of seconds to show the offer.
    if (!onPageRequiredSecondsTimeout) {
      onPageRequiredSecondsTimeout = setTimeout(() => {
        setIsOnPageRequiredSeconds(true);
      }, onPageRequiredSeconds * 1000);
    }
  }, [offerId, onPageRequiredSeconds]);

  if (!offer || !shop) {
    return null;
  }

  return (
    <OfferPopup
      open={popupOpen}
      shop={shop}
      theme={theme}
      ThemeComponent={ThemeComponent}
      offer={offer}
      locale={locale}
      countryCode={countryCode}
      currency={currency}
      triggerProduct={triggerProduct}
      offeredProducts={offeredProducts}
      shopifyCartItems={shopifyCartItems}
      shopifyCartTotal={shopifyCartTotal}
      shopifyCartItemCount={shopifyCartItemCount}
      onAddProducts={addProducts}
      onReplaceProduct={replaceProduct}
      onClose={handleClosePopup}
    />
  );
};

LinkClickOffer.propTypes = {
  shop: PropTypes.object.isRequired,
  offer: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  ThemeComponent: PropTypes.node,
  locale: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
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

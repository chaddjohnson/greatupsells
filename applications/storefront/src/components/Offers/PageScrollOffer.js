import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { OfferPopup } from '@greatupsells/react-components';
import {
  usePushStateListener,
  useEventListener
} from '@greatupsells/react-hooks';
import { useOfferTracking, useOfferAcceptance } from '../../hooks';

let delayTimeout = 0;
let onPageRequiredSecondsTimeout = 0;

// Tracked outside the component to prevent duplicate offer impressions.
let offerViewed = false;

const PageScrollOffer = ({
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
  const [delayFinished, setDelayFinished] = useState(false);
  const [isOnPageRequiredSeconds, setIsOnPageRequiredSeconds] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(
    window.pageYOffset || document.documentElement.scrollTop
  );

  const { trackOfferImpression } = useOfferTracking();
  const { addProducts, replaceProduct } = useOfferAcceptance();

  const offerId = offer?._id;
  const delaySeconds = offer?.delaySeconds || 0;
  const onPageRequiredSeconds = offer?.onPageRequiredSeconds || 0;

  const openPopup = useCallback(() => {
    offerViewed = true;

    onOpen();

    const triggerShopifyProductId = triggerProduct?.shopifyProductId;
    const offeredShopifyProductIds = offeredProducts.map(
      ({ shopifyProductData }) => shopifyProductData?.id
    );

    setPopupOpen(true);

    trackOfferImpression({
      offerId,
      triggerShopifyProductId,
      offeredShopifyProductIds
    });
  }, [offerId, triggerProduct, offeredProducts, trackOfferImpression, onOpen]);

  const handleClosePopup = () => {
    setPopupOpen(false);
    onClose();
  };

  const handleScroll = useCallback(
    () => {
      const defaultTriggerScrollThreshold = 75;
      const { triggerScrollThreshold = defaultTriggerScrollThreshold } =
        offer || {};

      // Reference: https://stackoverflow.com/a/31223774
      // Reference: https://javascript.info/size-and-scroll-window#width-height-of-the-document
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
      const windowHeight = window.innerHeight;
      const scrollPercentage = (scrollTop + windowHeight) / scrollHeight;
      const scrollingUp = lastScrollTop > scrollTop;

      setLastScrollTop(scrollTop);

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

      if (!delayFinished) {
        return;
      }

      // Ignore scroll up.
      if (scrollingUp) {
        return;
      }

      if (scrollPercentage >= triggerScrollThreshold / 100) {
        openPopup();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      offer,
      offerId,
      offerViewed,
      openPopup,
      viewingOffer,
      offeredProducts,
      isOnPageRequiredSeconds,
      delayFinished
    ]
  );

  // Listen to scroll events.
  useEventListener('scroll', handleScroll, true);

  // Listen to pushState events.
  usePushStateListener(() => {
    offerViewed = false;
    setPopupOpen(false);
    setIsOnPageRequiredSeconds(false);
    setLastScrollTop(0);

    clearTimeout(delayTimeout);
    clearTimeout(onPageRequiredSecondsTimeout);
  });

  useEffect(() => {
    if (!offerId) {
      return;
    }

    if (!delayTimeout) {
      delayTimeout = setTimeout(() => {
        setDelayFinished(true);
      }, delaySeconds * 1000);
    }
  }, [offerId, delaySeconds]);

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

PageScrollOffer.propTypes = {
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

PageScrollOffer.defaultProps = {
  shopifyCartItems: [],
  viewingOffer: false,
  onOpen: () => {},
  onClose: () => {}
};

export default PageScrollOffer;

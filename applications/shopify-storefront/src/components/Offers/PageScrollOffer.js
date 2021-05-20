import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import {
  usePushStateListener,
  useEventListener
} from '@neatowebsolutions/upselling-react-hooks';
import { useOfferTracking, useShop, useShopifyCart } from '../../hooks';

const loadedAt = new Date();

const PageScrollOffer = ({
  offer,
  popupTheme,
  offeredProducts,
  viewingOffer,
  onOpen,
  onClose
}) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [offerViewed, setOfferViewed] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(
    window.pageYOffset || document.documentElement.scrollTop
  );

  const { addProductToShopifyCart } = useShopifyCart();
  const { trackOfferImpression, trackOfferAcceptance } = useOfferTracking();
  const { shop } = useShop();

  const offerId = offer?._id;

  const openPopup = useCallback(() => {
    const delay = (offer?.delaySeconds || 0) * 1000;

    setOfferViewed(true);
    onOpen();

    setTimeout(async () => {
      const offeredShopifyProductIds = offeredProducts.map(
        ({ shopifyProductData }) => shopifyProductData?.id
      );
      const offeredShopifyVariantIds = offeredProducts.map(
        ({ shopifyProductData }) => shopifyProductData?.variants?.[0]?.id
      );

      setPopupOpen(true);

      await trackOfferImpression({
        offerId,
        offeredShopifyProductIds,
        offeredShopifyVariantIds
      });
    }, delay);
  }, [offer, offerId, offeredProducts, trackOfferImpression, onOpen]);

  const handleClosePopup = () => {
    setPopupOpen(false);
    onClose();
  };

  const handleAddProduct = async (
    shopifyProductId,
    shopifyVariantId,
    quantity
  ) => {
    // Accept the offer.
    const offerHit = await trackOfferAcceptance(
      offerId,
      shopifyProductId,
      shopifyVariantId,
      quantity
    );
    const variantIndex = offerHit.originalProducts.findIndex(
      (originalProduct) => originalProduct.shopifyVariantId === shopifyVariantId
    );
    const copiedShopifyVariantId =
      offerHit.acceptedProducts[variantIndex].shopifyVariantId;

    // Add the copied product variant to the cart.
    if (shopifyVariantId) {
      await addProductToShopifyCart(copiedShopifyVariantId, quantity);
    }
  };

  const handleScroll = useCallback(() => {
    // Reference: https://stackoverflow.com/a/31223774
    // Reference: https://javascript.info/size-and-scroll-window#width-height-of-the-document
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
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

    const secondsSinceLoad = (new Date() - loadedAt) / 1000;
    const onPageRequiredSeconds = offer?.onPageRequiredSeconds || 0;
    const isOnPageRequiredSeconds = secondsSinceLoad >= onPageRequiredSeconds;

    setLastScrollTop(scrollTop);

    // Nothing to show if there is no offer or product.
    if (!offerId) {
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

    // Ignore scroll up.
    if (scrollingUp) {
      return;
    }

    const defaultTriggerScrollThreshold = 75;
    const { triggerScrollThreshold = defaultTriggerScrollThreshold } = offer;

    if (scrollPercentage >= triggerScrollThreshold / 100) {
      openPopup();
    }
  }, [offer, offerId, offerViewed, openPopup, viewingOffer]); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen to scroll events.
  useEventListener('scroll', handleScroll, true);

  // Listen to pushState events.
  usePushStateListener(() => {
    setOfferViewed(false);
    setPopupOpen(false);
    setLastScrollTop(0);
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
      onClose={handleClosePopup}
    />
  );
};

PageScrollOffer.propTypes = {
  offer: PropTypes.object.isRequired,
  popupTheme: PropTypes.object.isRequired,
  offeredProducts: PropTypes.array.isRequired,
  viewingOffer: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func
};

PageScrollOffer.defaultProps = {
  viewingOffer: false,
  onOpen: () => {},
  onClose: () => {}
};

export default PageScrollOffer;

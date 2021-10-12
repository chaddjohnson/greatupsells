import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import { usePushStateListener } from '@neatowebsolutions/upselling-react-hooks';
import { useOfferTracking, useOfferAcceptance, useShop } from '../../hooks';

let delayTimeout = 0;
let onPageRequiredSecondsTimeout = 0;

const PageLoadOffer = ({
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

  const handleClosePopup = () => {
    setPopupOpen(false);
    onClose();
  };

  // Listen to pushState events.
  usePushStateListener(() => {
    setOfferViewed(false);
    setPopupOpen(false);
    setIsOnPageRequiredSeconds(false);
    clearTimeout(delayTimeout);
    clearTimeout(onPageRequiredSecondsTimeout);
  });

  useEffect(() => {
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

    // NOTE: Path (`triggerPagePath`) is tested in the API when querying for a random offer.
    // The page path (`pagePath`) is sent to the API via the useRandomOffer hook.

    openPopup();
  }, [
    offer,
    offerId,
    offerViewed,
    openPopup,
    viewingOffer,
    offeredProducts,
    isOnPageRequiredSeconds
  ]);

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

PageLoadOffer.propTypes = {
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

PageLoadOffer.defaultProps = {
  shopifyCartItems: [],
  viewingOffer: false,
  onOpen: () => {},
  onClose: () => {}
};

export default PageLoadOffer;

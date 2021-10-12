import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import { usePushStateListener } from '@neatowebsolutions/upselling-react-hooks';
import {
  useOfferTracking,
  useRandomOffers,
  useOfferAcceptance,
  useShop,
  useShopifyCart,
  useShopifyCartAddListener
} from '../../hooks';

const triggerEvent = 'ADD';
const loadedAt = new Date();
let delayTimeout = 0;
let onPageRequiredSecondsTimeout = 0;

const ProductOffer = ({
  shopifyCartItems,
  shopifyCartTotal,
  shopifyCartItemCount,
  viewingOffer,
  onOpen,
  onClose
}) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [offerViewed, setOfferViewed] = useState(false);
  const [delayFinished, setDelayFinished] = useState(false);
  const [isOnPageRequiredSeconds, setIsOnPageRequiredSeconds] = useState(false);
  const [shopifyProductIds, setShopifyProductIds] = useState([]);
  const [shopifyVariantIds, setShopifyVariantIds] = useState([]);
  const [productAdded, setProductAdded] = useState(false);

  const { shopifyCartLoading } = useShopifyCart();
  const { trackOfferImpression } = useOfferTracking();
  const { offersData: offerData = [] } = useRandomOffers({
    events: [triggerEvent],
    shopifyProductIds,
    shopifyVariantIds,
    shopifyCartTotal,
    shopifyCartItemCount,
    shouldQuery:
      productAdded &&
      !!shopifyProductIds?.length &&
      !!shopifyVariantIds?.length &&
      !shopifyCartLoading
  });
  const { addProduct, replaceProduct } = useOfferAcceptance();
  const { shop } = useShop();

  const { offer, popupTheme, triggerProduct, offeredProducts } =
    offerData?.[0] || {};
  const offerId = offer?._id;
  const delaySeconds = offer?.delaySeconds;
  const onPageRequiredSeconds = offer?.onPageRequiredSeconds;

  const openPopup = useCallback(() => {
    setOfferViewed(true);
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
    setShopifyProductIds([]);
    setShopifyVariantIds([]);
    setProductAdded(false);
    onClose();
  };

  // Subscribe to product add events for triggering the popup to show.
  useShopifyCartAddListener((addedProduct) => {
    if (!offerViewed && addedProduct) {
      setShopifyProductIds([addedProduct.product_id]);
      setShopifyVariantIds([addedProduct.variant_id]);
      setProductAdded(true);
    }
  });

  // Listen to pushState events.
  usePushStateListener(() => {
    setOfferViewed(false);
    setPopupOpen(false);
    setIsOnPageRequiredSeconds(false);
    setShopifyProductIds([]);
    setShopifyVariantIds([]);
    setProductAdded(false);
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

    if (!delayFinished) {
      return;
    }

    openPopup();
  }, [
    offer,
    offerId,
    offerViewed,
    openPopup,
    viewingOffer,
    offeredProducts,
    isOnPageRequiredSeconds,
    delayFinished
  ]);

  useEffect(() => {
    if (typeof delaySeconds === 'number') {
      if (delaySeconds > 0) {
        if (!delayTimeout) {
          delayTimeout = setTimeout(() => {
            setDelayFinished(true);
          }, delaySeconds * 1000);
        }
      } else {
        setDelayFinished(true);
      }
    }
  }, [delaySeconds]);

  useEffect(() => {
    const secondsSinceLoad = (new Date() - loadedAt) / 1000;
    const remainingSeconds = (onPageRequiredSeconds || 0) - secondsSinceLoad;

    if (typeof onPageRequiredSeconds === 'number') {
      if (remainingSeconds > 0) {
        // Wait the required number of seconds to show the offer
        onPageRequiredSecondsTimeout = setTimeout(() => {
          setIsOnPageRequiredSeconds(true);
        }, remainingSeconds * 1000);
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

ProductOffer.propTypes = {
  shopifyCartItems: PropTypes.array,
  shopifyCartTotal: PropTypes.number,
  shopifyCartItemCount: PropTypes.number,
  viewingOffer: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func
};

ProductOffer.defaultProps = {
  shopifyCartItems: [],
  viewingOffer: false,
  onOpen: () => {},
  onClose: () => {}
};

export default ProductOffer;

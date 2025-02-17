import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { OfferPopup } from '@greatupsells/react-components';
import { usePushStateListener } from '@greatupsells/react-hooks';
import {
  useOfferTracking,
  useRandomOffers,
  useOfferAcceptance,
  useShopifyCart,
  useShopifyCartAddListener,
  useThemeComponent
} from '../../hooks';

const queryString = new URLSearchParams(window.location.search);
const testToken = queryString.get('testToken');
const testOfferId = queryString.get('testOfferId');

const triggerEvent = 'ADD';
const loadedAt = new Date();
let delayTimeout = 0;
let onPageRequiredSecondsTimeout = 0;

const ProductOffer = ({
  shop,
  locale,
  countryCode,
  currency,
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

  const { shopifyCartLoaded, findTriggerProductShopifyVariantId } =
    useShopifyCart();
  const { trackOfferImpression } = useOfferTracking();
  const { offersData: offerData = [] } = useRandomOffers({
    events: [triggerEvent],
    shopifyProductIds,
    shopifyVariantIds,
    shopifyCartTotal,
    shopifyCartItemCount,
    testToken,
    testOfferId,
    shouldQuery:
      productAdded &&
      !!shopifyProductIds?.length &&
      !!shopifyVariantIds?.length &&
      shopifyCartLoaded
  });
  const { addProducts, replaceProduct } = useOfferAcceptance();

  const { offer, theme, triggerProduct, offeredProducts } =
    offerData?.[0] || {};
  const offerId = offer?._id;
  const delaySeconds = offer?.delaySeconds || 0;
  const onPageRequiredSeconds = offer?.onPageRequiredSeconds || 0;

  const ThemeComponent = useThemeComponent(theme?.key);

  const openPopup = useCallback(() => {
    setOfferViewed(true);
    onOpen();

    const triggerShopifyProductId = triggerProduct?.shopifyProductId;
    const triggerShopifyVariantId =
      findTriggerProductShopifyVariantId(triggerProduct);
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

    const secondsSinceLoad = (new Date() - loadedAt) / 1000;
    const remainingSeconds = Math.max(
      onPageRequiredSeconds - secondsSinceLoad,
      0
    );

    // Wait the required number of seconds to show the offer.
    if (!onPageRequiredSecondsTimeout) {
      onPageRequiredSecondsTimeout = setTimeout(() => {
        setIsOnPageRequiredSeconds(true);
      }, remainingSeconds * 1000);
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

ProductOffer.propTypes = {
  shop: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
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

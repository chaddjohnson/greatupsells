import React, { useState, useMemo } from 'react';
import { usePushStateListener } from '@neatowebsolutions/upselling-react-hooks';
import {
  useRandomOffers,
  useShopifyCart,
  useShopifyCartAddListener
} from '../../hooks';
import ExitIntentOffer from './ExitIntentOffer';
import LinkClickOffer from './LinkClickOffer';
import LostBrowserFocusOffer from './LostBrowserFocusOffer';
import PageLoadOffer from './PageLoadOffer';
import PageScrollOffer from './PageScrollOffer';
import ProductOffer from './ProductOffer';

const Offers = () => {
  const [viewingOffer, setViewingOffer] = useState(false);
  const [productAdded, setProductAdded] = useState(false);

  const {
    shopifyCartItems,
    shopifyCartSubtotal,
    shopifyCartItemCount,
    shopifyCartLoading
  } = useShopifyCart();

  const shopifyProductIds = useMemo(
    () => shopifyCartItems?.map((item) => item.product_id),
    [shopifyCartItems]
  );

  // Combine requests to reduce cost and minimize chances of exceeding Lambda concurrency limit.
  const { offersData = [] } = useRandomOffers({
    events: ['EXIT', 'LINK', 'FOCUS', 'LOAD', 'SCROLL'],
    shopifyProductIds,
    shouldQuery: !!shopifyCartItems && !shopifyCartLoading
  });

  // Group data by trigger event.
  const offerDataByTriggerEvent = useMemo(
    () =>
      offersData?.reduce((map, data) => {
        const triggerEvent = data?.offer?.triggerEvent;

        if (!triggerEvent) {
          return map;
        }

        return {
          ...map,
          [triggerEvent]: data
        };
      }, {}),
    [offersData]
  );

  const handleOfferOpen = () => {
    setViewingOffer(true);
  };

  const handleOfferClose = () => {
    setViewingOffer(false);
  };

  // Subscribe to product add events.
  useShopifyCartAddListener((addedProduct) => {
    if (addedProduct?.product_id) {
      setProductAdded(true);
    }
  });

  // Listen to pushState events.
  usePushStateListener(() => {
    setProductAdded(false);
  });

  return (
    <>
      <ExitIntentOffer
        offer={offerDataByTriggerEvent.EXIT?.offer}
        popupTheme={offerDataByTriggerEvent.EXIT?.popupTheme}
        triggerProduct={offerDataByTriggerEvent.EXIT?.triggerProduct}
        offeredProducts={offerDataByTriggerEvent.EXIT?.offeredProducts}
        shopifyCartSubtotal={shopifyCartSubtotal}
        shopifyCartItemCount={shopifyCartItemCount}
        viewingOffer={viewingOffer}
        onOpen={handleOfferOpen}
        onClose={handleOfferClose}
      />
      <LinkClickOffer
        offer={offerDataByTriggerEvent.LINK?.offer}
        popupTheme={offerDataByTriggerEvent.LINK?.popupTheme}
        triggerProduct={offerDataByTriggerEvent.LINK?.triggerProduct}
        offeredProducts={offerDataByTriggerEvent.LINK?.offeredProducts}
        shopifyCartSubtotal={shopifyCartSubtotal}
        shopifyCartItemCount={shopifyCartItemCount}
        viewingOffer={viewingOffer}
        onOpen={handleOfferOpen}
        onClose={handleOfferClose}
      />
      <LostBrowserFocusOffer
        offer={offerDataByTriggerEvent.FOCUS?.offer}
        popupTheme={offerDataByTriggerEvent.FOCUS?.popupTheme}
        triggerProduct={offerDataByTriggerEvent.FOCUS?.triggerProduct}
        offeredProducts={offerDataByTriggerEvent.FOCUS?.offeredProducts}
        shopifyCartSubtotal={shopifyCartSubtotal}
        shopifyCartItemCount={shopifyCartItemCount}
        viewingOffer={viewingOffer}
        onOpen={handleOfferOpen}
        onClose={handleOfferClose}
      />
      {!productAdded && (
        <PageLoadOffer
          offer={offerDataByTriggerEvent.LOAD?.offer}
          popupTheme={offerDataByTriggerEvent.LOAD?.popupTheme}
          triggerProduct={offerDataByTriggerEvent.LOAD?.triggerProduct}
          offeredProducts={offerDataByTriggerEvent.LOAD?.offeredProducts}
          shopifyCartSubtotal={shopifyCartSubtotal}
          shopifyCartItemCount={shopifyCartItemCount}
          viewingOffer={viewingOffer}
          onOpen={handleOfferOpen}
          onClose={handleOfferClose}
        />
      )}
      <PageScrollOffer
        offer={offerDataByTriggerEvent.SCROLL?.offer}
        popupTheme={offerDataByTriggerEvent.SCROLL?.popupTheme}
        triggerProduct={offerDataByTriggerEvent.SCROLL?.triggerProduct}
        offeredProducts={offerDataByTriggerEvent.SCROLL?.offeredProducts}
        shopifyCartSubtotal={shopifyCartSubtotal}
        shopifyCartItemCount={shopifyCartItemCount}
        viewingOffer={viewingOffer}
        onOpen={handleOfferOpen}
        onClose={handleOfferClose}
      />
      <ProductOffer
        shopifyCartSubtotal={shopifyCartSubtotal}
        shopifyCartItemCount={shopifyCartItemCount}
        viewingOffer={viewingOffer}
        onOpen={handleOfferOpen}
        onClose={handleOfferClose}
      />
    </>
  );
};

export default Offers;

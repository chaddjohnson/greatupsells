import React, { useState, useMemo } from 'react';
import { usePushStateListener } from '@greatupsells/react-hooks';
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
import ThankYouPageOffer from './ThankYouPageOffer';

const Offers = () => {
  const [viewingOffer, setViewingOffer] = useState(false);
  const [productAdded, setProductAdded] = useState(false);

  const {
    shopifyCartItems,
    shopifyCartTotal,
    shopifyCartItemCount,
    shopifyCartLoading
  } = useShopifyCart();

  const shopifyProductIds = useMemo(
    () => shopifyCartItems?.map((item) => item.product_id),
    [shopifyCartItems]
  );
  const shopifyVariantIds = useMemo(
    () => shopifyCartItems?.map((item) => item.variant_id),
    [shopifyCartItems]
  );
  const shopifyOrderId = window.Shopify?.checkout?.order_id;

  // Combine requests to reduce cost and minimize chances of exceeding Lambda concurrency limit.
  const { offersData = [] } = useRandomOffers({
    events: ['EXIT', 'LINK', 'FOCUS', 'LOAD', 'SCROLL'],
    shopifyProductIds,
    shopifyVariantIds,
    shopifyCartTotal,
    shopifyCartItemCount,
    shopifyOrderId,
    shouldQuery: !!shopifyCartItems && !shopifyCartLoading
  });

  // Group data by trigger event.
  const offerDataByTriggerEvent = useMemo(
    () =>
      offersData?.reduce((map, data) => {
        const strategy = data?.offer?.strategy;
        const triggerEvent = data?.offer?.triggerEvent;

        if (!triggerEvent) {
          return map;
        }

        if (strategy === 'THANK_YOU_PAGE') {
          return map;
        }

        return {
          ...map,
          [triggerEvent]: data
        };
      }, {}),
    [offersData]
  );
  const thankYouPageOfferData = useMemo(() => {
    return offersData?.find(
      ({ offer }) => offer?.strategy === 'THANK_YOU_PAGE'
    );
  }, [offersData]);

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
        theme={offerDataByTriggerEvent.EXIT?.theme}
        triggerProduct={offerDataByTriggerEvent.EXIT?.triggerProduct}
        offeredProducts={offerDataByTriggerEvent.EXIT?.offeredProducts}
        shopifyCartItems={shopifyCartItems}
        shopifyCartTotal={shopifyCartTotal}
        shopifyCartItemCount={shopifyCartItemCount}
        viewingOffer={viewingOffer}
        onOpen={handleOfferOpen}
        onClose={handleOfferClose}
      />
      <LinkClickOffer
        offer={offerDataByTriggerEvent.LINK?.offer}
        theme={offerDataByTriggerEvent.LINK?.theme}
        triggerProduct={offerDataByTriggerEvent.LINK?.triggerProduct}
        offeredProducts={offerDataByTriggerEvent.LINK?.offeredProducts}
        shopifyCartItems={shopifyCartItems}
        shopifyCartTotal={shopifyCartTotal}
        shopifyCartItemCount={shopifyCartItemCount}
        viewingOffer={viewingOffer}
        onOpen={handleOfferOpen}
        onClose={handleOfferClose}
      />
      <LostBrowserFocusOffer
        offer={offerDataByTriggerEvent.FOCUS?.offer}
        theme={offerDataByTriggerEvent.FOCUS?.theme}
        triggerProduct={offerDataByTriggerEvent.FOCUS?.triggerProduct}
        offeredProducts={offerDataByTriggerEvent.FOCUS?.offeredProducts}
        shopifyCartItems={shopifyCartItems}
        shopifyCartTotal={shopifyCartTotal}
        shopifyCartItemCount={shopifyCartItemCount}
        viewingOffer={viewingOffer}
        onOpen={handleOfferOpen}
        onClose={handleOfferClose}
      />
      {!productAdded && (
        <PageLoadOffer
          offer={offerDataByTriggerEvent.LOAD?.offer}
          theme={offerDataByTriggerEvent.LOAD?.theme}
          triggerProduct={offerDataByTriggerEvent.LOAD?.triggerProduct}
          offeredProducts={offerDataByTriggerEvent.LOAD?.offeredProducts}
          shopifyCartItems={shopifyCartItems}
          shopifyCartTotal={shopifyCartTotal}
          shopifyCartItemCount={shopifyCartItemCount}
          viewingOffer={viewingOffer}
          onOpen={handleOfferOpen}
          onClose={handleOfferClose}
        />
      )}
      <PageScrollOffer
        offer={offerDataByTriggerEvent.SCROLL?.offer}
        theme={offerDataByTriggerEvent.SCROLL?.theme}
        triggerProduct={offerDataByTriggerEvent.SCROLL?.triggerProduct}
        offeredProducts={offerDataByTriggerEvent.SCROLL?.offeredProducts}
        shopifyCartItems={shopifyCartItems}
        shopifyCartTotal={shopifyCartTotal}
        shopifyCartItemCount={shopifyCartItemCount}
        viewingOffer={viewingOffer}
        onOpen={handleOfferOpen}
        onClose={handleOfferClose}
      />
      <ProductOffer
        shopifyCartItems={shopifyCartItems}
        shopifyCartTotal={shopifyCartTotal}
        shopifyCartItemCount={shopifyCartItemCount}
        viewingOffer={viewingOffer}
        onOpen={handleOfferOpen}
        onClose={handleOfferClose}
      />
      <ThankYouPageOffer
        offer={thankYouPageOfferData?.offer}
        theme={thankYouPageOfferData?.theme}
        triggerProduct={thankYouPageOfferData?.triggerProduct}
        offeredProducts={thankYouPageOfferData?.offeredProducts}
      />
    </>
  );
};

export default Offers;

import React, { useMemo } from 'react';
import { useRandomOffers, useShopifyCart } from '../../hooks';
import ExitIntentOffer from './ExitIntentOffer';
import LinkClickOffer from './LinkClickOffer';
import LostBrowserFocusOffer from './LostBrowserFocusOffer';
import PageLoadOffer from './PageLoadOffer';
import PageScrollOffer from './PageScrollOffer';
import ProductOffer from './ProductOffer';

const Offers = () => {
  const { shopifyCartItems, shopifyCartItemsLoading } = useShopifyCart();

  const shopifyProductIds = useMemo(
    () => shopifyCartItems?.map((item) => item.product_id),
    [shopifyCartItems]
  );

  // Combine requests to reduce cost and minimize chances of exceeding Lambda concurrency limit.
  const { offersData = [] } = useRandomOffers({
    events: ['EXIT', 'LINK', 'FOCUS', 'LOAD', 'SCROLL'],
    shopifyProductIds,
    shouldQuery: !!shopifyCartItems && !shopifyCartItemsLoading
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

  return (
    <>
      <ExitIntentOffer
        offer={offerDataByTriggerEvent.EXIT?.offer}
        popupTheme={offerDataByTriggerEvent.EXIT?.popupTheme}
        offeredProducts={offerDataByTriggerEvent.EXIT?.offeredProducts}
      />
      <LinkClickOffer
        offer={offerDataByTriggerEvent.LINK?.offer}
        popupTheme={offerDataByTriggerEvent.LINK?.popupTheme}
        offeredProducts={offerDataByTriggerEvent.LINK?.offeredProducts}
      />
      <LostBrowserFocusOffer
        offer={offerDataByTriggerEvent.FOCUS?.offer}
        popupTheme={offerDataByTriggerEvent.FOCUS?.popupTheme}
        offeredProducts={offerDataByTriggerEvent.FOCUS?.offeredProducts}
      />
      <PageLoadOffer
        offer={offerDataByTriggerEvent.LOAD?.offer}
        popupTheme={offerDataByTriggerEvent.LOAD?.popupTheme}
        offeredProducts={offerDataByTriggerEvent.LOAD?.offeredProducts}
      />
      <PageScrollOffer
        offer={offerDataByTriggerEvent.SCROLL?.offer}
        popupTheme={offerDataByTriggerEvent.SCROLL?.popupTheme}
        offeredProducts={offerDataByTriggerEvent.SCROLL?.offeredProducts}
      />
      <ProductOffer />
    </>
  );
};

export default Offers;

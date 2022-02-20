import React, { useState, useMemo } from 'react';
import { usePushStateListener } from '@greatupsells/react-hooks';
import {
  useShop,
  useRandomOffers,
  useShopifyCart,
  useShopifyCartAddListener,
  useShopifyCustomer
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

  const { shop } = useShop();
  const {
    getCustomerLocale,
    getCustomerCountryCode,
    getCustomerCurrency
  } = useShopifyCustomer();

  // Get locale.
  const customerLocale = getCustomerLocale();
  const shopLocale = shop?.locale;
  const defaultLocale = 'en';
  const locale = customerLocale || shopLocale || defaultLocale;

  // Get country code.
  const customerCountryCode = getCustomerCountryCode();
  const shopCountryCode = shop?.countryCode;
  const defaultCountryCode = 'US';
  const countryCode =
    customerCountryCode || shopCountryCode || defaultCountryCode;

  // Get currency.
  const customerCurrency = getCustomerCurrency();
  const shopCurrency = shop?.currency;
  const defaultCurrency = 'USD';
  const currency = customerCurrency || shopCurrency || defaultCurrency;

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
        shop={shop}
        offer={offerDataByTriggerEvent.EXIT?.offer}
        theme={offerDataByTriggerEvent.EXIT?.theme}
        locale={locale}
        countryCode={countryCode}
        currency={currency}
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
        shop={shop}
        offer={offerDataByTriggerEvent.LINK?.offer}
        theme={offerDataByTriggerEvent.LINK?.theme}
        locale={locale}
        countryCode={countryCode}
        currency={currency}
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
        shop={shop}
        offer={offerDataByTriggerEvent.FOCUS?.offer}
        theme={offerDataByTriggerEvent.FOCUS?.theme}
        locale={locale}
        countryCode={countryCode}
        currency={currency}
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
          shop={shop}
          offer={offerDataByTriggerEvent.LOAD?.offer}
          theme={offerDataByTriggerEvent.LOAD?.theme}
          locale={locale}
          countryCode={countryCode}
          currency={currency}
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
        shop={shop}
        offer={offerDataByTriggerEvent.SCROLL?.offer}
        theme={offerDataByTriggerEvent.SCROLL?.theme}
        locale={locale}
        countryCode={countryCode}
        currency={currency}
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
        shop={shop}
        locale={locale}
        countryCode={countryCode}
        currency={currency}
        shopifyCartItems={shopifyCartItems}
        shopifyCartTotal={shopifyCartTotal}
        shopifyCartItemCount={shopifyCartItemCount}
        viewingOffer={viewingOffer}
        onOpen={handleOfferOpen}
        onClose={handleOfferClose}
      />
      <ThankYouPageOffer
        shop={shop}
        offer={thankYouPageOfferData?.offer}
        theme={thankYouPageOfferData?.theme}
        locale={locale}
        countryCode={countryCode}
        currency={currency}
        triggerProduct={thankYouPageOfferData?.triggerProduct}
        offeredProducts={thankYouPageOfferData?.offeredProducts}
      />
    </>
  );
};

export default Offers;

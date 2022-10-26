import React, { useState, useMemo } from 'react';
import {
  useShop,
  useRandomOffers,
  useShopifyCart,
  useShopifyCustomer,
  useThemeComponent
} from '../../hooks';
import ExitIntentOffer from './ExitIntentOffer';
import LinkClickOffer from './LinkClickOffer';
import LostBrowserFocusOffer from './LostBrowserFocusOffer';
import PageLoadOffer from './PageLoadOffer';
import PageScrollOffer from './PageScrollOffer';
import ProductOffer from './ProductOffer';
import ThankYouPageOffer from './ThankYouPageOffer';
import OrderStatusPageOffer from './OrderStatusPageOffer';

const Offers = () => {
  const [viewingOffer, setViewingOffer] = useState(false);

  const {
    shopifyCartItems,
    shopifyCartTotal,
    shopifyCartItemCount,
    shopifyCartLoaded
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
    shouldQuery: !!shopifyCartItems && shopifyCartLoaded
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

        if (strategy === 'THANK_YOU_PAGE' || strategy === 'ORDER_STATUS_PAGE') {
          return map;
        }

        // Do not render Post-Purchase offers in the storefront.
        if (strategy === 'POST_PURCHASE') {
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
  const isThankYouPage = window.Shopify?.Checkout?.page === 'thank_you';

  const orderStatusPageOfferData = useMemo(() => {
    return offersData?.find(
      ({ offer }) => offer?.strategy === 'ORDER_STATUS_PAGE'
    );
  }, [offersData]);
  const isOrderStatusPage = window.Shopify?.Checkout?.isOrderStatusPage;

  const ExitIntentThemeComponent = useThemeComponent(
    offerDataByTriggerEvent.EXIT?.theme.key
  );
  const LinkClickThemeComponent = useThemeComponent(
    offerDataByTriggerEvent.LINK?.theme.key
  );
  const LostBrowserFocusThemeComponent = useThemeComponent(
    offerDataByTriggerEvent.FOCUS?.theme.key
  );
  const PageLoadThemeComponent = useThemeComponent(
    offerDataByTriggerEvent.LOAD?.theme.key
  );
  const PageScrollThemeComponent = useThemeComponent(
    offerDataByTriggerEvent.SCROLL?.theme.key
  );
  const ThankYouPageThemeComponent = useThemeComponent(
    thankYouPageOfferData?.theme.key
  );
  const OrderStatusPageThemeComponent = useThemeComponent(
    orderStatusPageOfferData?.theme.key
  );

  const handleOfferOpen = () => {
    setViewingOffer(true);
  };

  const handleOfferClose = () => {
    setViewingOffer(false);
  };

  return (
    <>
      <ExitIntentOffer
        shop={shop}
        offer={offerDataByTriggerEvent.EXIT?.offer}
        theme={offerDataByTriggerEvent.EXIT?.theme}
        ThemeComponent={ExitIntentThemeComponent}
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
        ThemeComponent={LinkClickThemeComponent}
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
        ThemeComponent={LostBrowserFocusThemeComponent}
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
      <PageLoadOffer
        shop={shop}
        offer={offerDataByTriggerEvent.LOAD?.offer}
        theme={offerDataByTriggerEvent.LOAD?.theme}
        ThemeComponent={PageLoadThemeComponent}
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
      <PageScrollOffer
        shop={shop}
        offer={offerDataByTriggerEvent.SCROLL?.offer}
        theme={offerDataByTriggerEvent.SCROLL?.theme}
        ThemeComponent={PageScrollThemeComponent}
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
      {isThankYouPage && (
        <ThankYouPageOffer
          shop={shop}
          offer={thankYouPageOfferData?.offer}
          theme={thankYouPageOfferData?.theme}
          ThemeComponent={ThankYouPageThemeComponent}
          locale={locale}
          countryCode={countryCode}
          currency={currency}
          triggerProduct={thankYouPageOfferData?.triggerProduct}
          offeredProducts={thankYouPageOfferData?.offeredProducts}
        />
      )}
      {isOrderStatusPage && (
        <OrderStatusPageOffer
          shop={shop}
          offer={orderStatusPageOfferData?.offer}
          theme={orderStatusPageOfferData?.theme}
          ThemeComponent={OrderStatusPageThemeComponent}
          locale={locale}
          countryCode={countryCode}
          currency={currency}
          triggerProduct={orderStatusPageOfferData?.triggerProduct}
          offeredProducts={orderStatusPageOfferData?.offeredProducts}
        />
      )}
    </>
  );
};

export default Offers;

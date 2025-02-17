import { useState } from 'react';
import useSWR from 'swr';
import { useHttpClient, useCookies, usePushStateListener } from '@greatupsells/react-hooks';

const useRandomOffers = ({
  events,
  shopifyProductIds = [],
  shopifyVariantIds = [],
  shopifyCartTotal = 0,
  shopifyCartItemCount = 0,
  shopifyOrderId = undefined,
  testToken = undefined,
  testOfferId = undefined,
  shouldQuery = true
}) => {
  // Ensure Shopify product and variant IDs is an array.
  if (!Array.isArray(shopifyProductIds)) {
    shopifyProductIds = [shopifyProductIds];
  }
  if (!Array.isArray(shopifyVariantIds)) {
    shopifyVariantIds = [shopifyVariantIds];
  }

  // Ensure Shopify IDs are numeric.
  shopifyProductIds = shopifyProductIds.map((shopifyProductId) => parseInt(shopifyProductId));
  shopifyVariantIds = shopifyVariantIds.map((shopifyVariantId) => parseInt(shopifyVariantId));

  // Filter out empty values.
  shopifyProductIds = shopifyProductIds.filter(Boolean);
  shopifyVariantIds = shopifyVariantIds.filter(Boolean);

  const { httpClient } = useHttpClient();
  const { getCookie } = useCookies();

  // Use state so tracking data is not not re-read with every render; otherwise,
  // the API will undesirably be requeried whenever tracking data is updated.
  const [offerImpressions, setOfferImpressions] = useState(getCookie('greatupsellsOfferImpressions') || []);
  const [sessionOfferImpressions, setSessionOfferImpressions] = useState(
    sessionStorage.greatupsellsSessionOfferImpressions ? JSON.parse(sessionStorage.greatupsellsSessionOfferImpressions) : []
  );
  const [pagePath, setPagePath] = useState(window.location.pathname);

  // Use POST instead of GET here to side step query string formatting
  // weirdness and query string length issues.
  const { data: offersData } = useSWR(
    shouldQuery
      ? JSON.stringify([events, shopifyOrderId, offerImpressions, sessionOfferImpressions, pagePath, testToken, testOfferId])
      : null,
    () =>
      httpClient.post('/offers/random', {
        events,
        shopifyProductIds,
        shopifyVariantIds,
        shopifyCartTotal,
        shopifyCartItemCount,
        shopifyOrderId,
        offerImpressions,
        sessionOfferImpressions,
        pagePath,
        testToken,
        testOfferId
      }),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false
    }
  );

  const pushStateListener = () => {
    // Update stateful values. This will automatically trigger a re-query for a random offer.
    setOfferImpressions(getCookie('greatupsellsOfferImpressions') || []);
    setSessionOfferImpressions(
      sessionStorage.greatupsellsSessionOfferImpressions
        ? JSON.parse(sessionStorage.greatupsellsSessionOfferImpressions)
        : []
    );
    setPagePath(window.location.pathname);
  };

  // Listen to pushState events.
  usePushStateListener(pushStateListener);

  return { offersData };
};

export default useRandomOffers;

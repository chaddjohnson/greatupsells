import { useState } from 'react';
import useSWR from 'swr';
import {
  useHttpClient,
  useCookies,
  usePushStateListener
} from '@neatowebsolutions/greatupsells-react-hooks';

const useRandomOffers = ({
  events,
  shopifyProductIds = [],
  shopifyVariantIds = [],
  shopifyCartTotal = 0,
  shopifyCartItemCount = 0,
  shouldQuery = true
}) => {
  // Ensure Shopify product IDs is an array.
  if (!Array.isArray(shopifyProductIds)) {
    shopifyProductIds = [shopifyProductIds].filter(Boolean);
  }

  // Ensure Shopify IDs are numeric.
  shopifyProductIds = shopifyProductIds.map((shopifyProductId) =>
    parseInt(shopifyProductId)
  );
  shopifyVariantIds = shopifyVariantIds.map((shopifyVariantId) =>
    parseInt(shopifyVariantId)
  );

  const { httpClient } = useHttpClient();
  const { getCookie } = useCookies();

  // Use state so tracking data is not not re-read with every render; otherwise,
  // the API will undesirably be requeried whenever tracking data is updated.
  const [offerImpressions, setOfferImpressions] = useState(
    getCookie('greatupsellsOfferImpressions') || []
  );
  const [sessionOfferImpressions, setSessionOfferImpressions] = useState(
    sessionStorage.greatupsellsSessionOfferImpressions
      ? JSON.parse(sessionStorage.greatupsellsSessionOfferImpressions)
      : []
  );
  const [pagePath, setPagePath] = useState(window.location.pathname);

  // Use POST instead of GET here to side step query string formatting
  // weirdness and query string length issues.
  const { data: offersData } = useSWR(
    shouldQuery
      ? JSON.stringify([
          events,
          shopifyProductIds,
          shopifyVariantIds,
          shopifyCartTotal,
          shopifyCartItemCount,
          offerImpressions,
          sessionOfferImpressions,
          pagePath
        ])
      : null,
    () =>
      httpClient.post('/offers/random', {
        events,
        shopifyProductIds,
        shopifyVariantIds,
        shopifyCartTotal,
        shopifyCartItemCount,
        offerImpressions,
        sessionOfferImpressions,
        pagePath
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

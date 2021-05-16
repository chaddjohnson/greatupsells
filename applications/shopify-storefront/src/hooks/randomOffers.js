import { useState } from 'react';
import useSWR from 'swr';
import { compact } from 'lodash';
import {
  useHttpClient,
  useCookies,
  usePushStateListener
} from '@neatowebsolutions/upselling-react-hooks';

const useRandomOffers = ({
  events,
  shopifyProductIds = [],
  shouldQuery = true
}) => {
  // Ensure Shopify product IDs is an array.
  if (!Array.isArray(shopifyProductIds)) {
    shopifyProductIds = compact([shopifyProductIds]);
  }

  // Ensure Shopify product IDs are numeric.
  shopifyProductIds = shopifyProductIds.map((shopifyProductId) =>
    parseInt(shopifyProductId)
  );

  const { httpClient } = useHttpClient();
  const { getCookie } = useCookies();

  // Use state so tracking data is not not re-read with every render; otherwise,
  // the API will undesirably be requeried whenever tracking data is updated.
  const [offerImpressions, setOfferImpressions] = useState(
    getCookie('upsellingOfferImpressions') || []
  );
  const [sessionOfferImpressions, setSessionOfferImpressions] = useState(
    sessionStorage.upsellingSessionOfferImpressions
      ? JSON.parse(sessionStorage.upsellingSessionOfferImpressions)
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
          offerImpressions,
          sessionOfferImpressions,
          pagePath
        ])
      : null,
    () =>
      httpClient.post('/offers/random', {
        events,
        shopifyProductIds,
        offerImpressions,
        sessionOfferImpressions,
        pagePath
      }),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false
    }
  );

  // Listen to pushState events.
  usePushStateListener(() => {
    // Update stateful values. This will automatically trigger a re-query for a random offer.
    setOfferImpressions(getCookie('upsellingOfferImpressions') || []);
    setSessionOfferImpressions(
      sessionStorage.upsellingSessionOfferImpressions
        ? JSON.parse(sessionStorage.upsellingSessionOfferImpressions)
        : []
    );
    setPagePath(window.location.pathname);
  });

  return { offersData };
};

export default useRandomOffers;

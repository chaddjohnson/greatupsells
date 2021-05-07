import { useState } from 'react';
import useSWR from 'swr';
import {
  useHttpClient,
  useCookies,
  usePushStateListener
} from '@neatowebsolutions/upselling-react-hooks';

const useRandomOffer = ({ event, shopifyProductIds = [] }) => {
  if (!Array.isArray(shopifyProductIds)) {
    shopifyProductIds = [shopifyProductIds];
  }

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
  const [pageUrl, setPageUrl] = useState(window.location.pathname);

  const isAddEvent = event === 'ADD' && !!shopifyProductIds?.length;
  const isCartEvent = event === 'CART';
  const isLoadEvent = event === 'LOAD';
  const isExitEvent = event === 'EXIT';
  const shouldQuery = isAddEvent || isCartEvent || isLoadEvent || isExitEvent;

  // Use POST instead of GET here to side step query string formatting
  // weirdness and query string length issues.
  const { data } = useSWR(
    shouldQuery
      ? [`random-${event}`, offerImpressions, sessionOfferImpressions, pageUrl]
      : null,
    () =>
      httpClient.post('/offers/random', {
        event,
        shopifyProductIds,
        offerImpressions,
        sessionOfferImpressions
      }),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false
    }
  );
  const { offer, popupTheme, triggerProduct, offeredProducts = [] } =
    data || {};

  // Listen to pushState events.
  usePushStateListener(() => {
    // Update stateful values. This will trigger a re-query for a random offer.
    setOfferImpressions(getCookie('upsellingOfferImpressions') || []);
    setSessionOfferImpressions(
      sessionStorage.upsellingSessionOfferImpressions
        ? JSON.parse(sessionStorage.upsellingSessionOfferImpressions)
        : []
    );
    setPageUrl(window.location.pathname);
  });

  return {
    offer,
    popupTheme,
    triggerProduct,
    offeredProducts
  };
};

export default useRandomOffer;

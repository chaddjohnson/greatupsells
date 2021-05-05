import { useState } from 'react';
import useSWR from 'swr';
import {
  useHttpClient,
  useCookies,
  usePushState
} from '@neatowebsolutions/upselling-react-hooks';

const useRandomOffer = ({ event, shopifyProductIds = [] }) => {
  if (!Array.isArray(shopifyProductIds)) {
    shopifyProductIds = [shopifyProductIds];
  }

  const { httpClient } = useHttpClient();
  const { getCookie } = useCookies();

  // Use state so tracking data is not not re-read with every render; otherwise,
  // the API will undesirably be requeried whenever tracking data is updated.
  const [offerViews, setOfferViews] = useState(
    getCookie('upsellingOfferViews') || []
  );
  const [sessionOfferViews, setSessionOfferViews] = useState(
    sessionStorage.upsellingSessionOfferViews
      ? JSON.parse(sessionStorage.upsellingSessionOfferViews)
      : []
  );
  const [pageUrl, setPageUrl] = useState(window.location.pathname);

  const isLoadEvent = event === 'LOAD';
  const isExitEvent = event === 'EXIT';
  const isProductEvent = !!shopifyProductIds?.length;
  const shouldQuery = isLoadEvent || isExitEvent || isProductEvent;

  // Use POST instead of GET here to side step query string formatting
  // weirdness and query string length issues.
  const { data } = useSWR(
    shouldQuery
      ? [`random-${event}`, offerViews, sessionOfferViews, pageUrl]
      : null,
    () =>
      httpClient.post('/offers/random', {
        event,
        shopifyProductIds,
        offerViews,
        sessionOfferViews
      }),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false
    }
  );
  const { offer, popupTheme, triggerProduct, offeredProducts = [] } =
    data || {};

  usePushState(() => {
    // Update stateful values on path change. This will trigger a re-query for a random offer.
    setOfferViews(getCookie('upsellingOfferViews') || []);
    setSessionOfferViews(
      sessionStorage.upsellingSessionOfferViews
        ? JSON.parse(sessionStorage.upsellingSessionOfferViews)
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

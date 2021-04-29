import { useState } from 'react';
import useSWR from 'swr';
import {
  useHttpClient,
  useCookies
} from '@neatowebsolutions/upselling-react-hooks';

const useRandomOffer = ({ event, shopifyProductIds = [] }) => {
  if (!Array.isArray(shopifyProductIds)) {
    shopifyProductIds = [shopifyProductIds];
  }

  const { httpClient } = useHttpClient();
  const { getCookie } = useCookies();

  // Use state so that cookies are not re-read with every render. If cookies
  // are re-read with every render, the API will undesirably be requeried
  // whenever cookies are updated.
  const [offerViews] = useState(getCookie('upsellingOfferViews') || []);
  const [sessionOfferViews] = useState(
    sessionStorage.upsellingSessionOfferViews
      ? JSON.parse(sessionStorage.upsellingSessionOfferViews)
      : []
  );

  const isLoadEvent = event === 'LOAD';
  const isExitEvent = event === 'EXIT';
  const isProductEvent = !!shopifyProductIds?.length;
  const shouldQuery = isLoadEvent || isExitEvent || isProductEvent;

  // Use POST instead of GET here to side step query string formatting
  // weirdness and query string length issues.
  const { data } = useSWR(
    shouldQuery ? `random-${event}` : null,
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

  return {
    offer,
    popupTheme,
    triggerProduct,
    offeredProducts
  };
};

export default useRandomOffer;

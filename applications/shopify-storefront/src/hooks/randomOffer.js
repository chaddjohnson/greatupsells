import { useMemo } from 'react';
import qs from 'qs';
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

  const offerViews = getCookie('upsellingOfferViews') || { events: [] };

  // Query only when an offer has not already shown for the event. This
  // reduces costly API traffic by preventing unnecessary API requests
  // on every page load across potentially thousands of sites.
  const offerViewedForEvent = useMemo(
    () => offerViews.events.includes(event),
    [event] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const isLoadEvent = event === 'LOAD';
  const isExitEvent = event === 'EXIT';
  const isProductEvent = !!shopifyProductIds?.length;
  const shouldQuery =
    !offerViewedForEvent && (isLoadEvent || isExitEvent || isProductEvent);

  const params = qs.stringify(
    {
      event,
      shopifyProductIds
    },
    { arrayFormat: 'repeat' }
  );

  const { data } = useSWR(
    shouldQuery ? `/offers/random?${params}` : null,
    httpClient.get.bind(httpClient),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false
    }
  );
  const { offer, product } = data || {};

  return { offer, product };
};

export default useRandomOffer;

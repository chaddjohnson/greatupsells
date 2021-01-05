import useSWR from 'swr';
import {
  useHttpClient,
  useCookies
} from '@neatowebsolutions/upselling-react-hooks';

const useRandomOffer = ({ event, productIds }) => {
  const { httpClient } = useHttpClient();
  const { getCookie } = useCookies();

  const offerViews = getCookie('upsellingOfferViews') || { events: [] };

  // A query should be performed for shop visit (LOAD) events, exit intent
  // (EXIT) events, and when product IDs are available, but only when an offer
  // has not already shown for the event. This reduces costly API traffic by
  // preventing unnecessary API requests on every page load across potentially
  // thousands of sites.
  const offerViewedForEvent = offerViews.events.includes(event);
  const isLoadEvent = event === 'LOAD';
  const isExitEvent = event === 'EXIT';
  const isProductEvent = !!productIds?.length;
  const shouldQuery =
    !offerViewedForEvent && (isLoadEvent || isExitEvent || isProductEvent);

  const shopifyProductIdsParam = productIds.map(
    (shopifyProductId) => `shopifyProductIds=${shopifyProductId}`
  );

  const { data: offer } = useSWR(
    shouldQuery
      ? `/offers/random?event=${event}&${shopifyProductIdsParam}`
      : null,
    httpClient.get,
    { revalidateOnFocus: false }
  );

  return { offer };
};

export default useRandomOffer;

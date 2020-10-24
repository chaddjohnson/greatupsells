import { useQuery } from '@neatowebsolutions/upselling-graphql-client';
import { RANDOM_OFFER_QUERY } from '@neatowebsolutions/upselling-graphql-queries';
import useCookies from './cookies';

const useRandomOffer = ({ event, productIds, onSuccess = () => {} }) => {
  const { getCookie } = useCookies();

  const offerViews = getCookie('upsellingOfferViews') || {
    events: [],
    offers: []
  };

  // A query should be performed for shop visit (LOAD) events, exit intent
  // (EXIT) events, and when product IDs are available, but only when an offer
  // has not already shown for the event. This reduces API traffic and costs by
  // preventing unnecessary API requests on every page load.
  const offerViewedForEvent = offerViews.events.includes(event);
  const isLoadEvent = event === 'LOAD';
  const isExitEvent = event === 'EXIT';
  const isProductEvent = !!productIds?.length;
  const shouldQuery =
    !offerViewedForEvent && (isLoadEvent || isExitEvent || isProductEvent);

  const { data: offer, loading: offerLoading, error: offerError } = useQuery(
    shouldQuery ? RANDOM_OFFER_QUERY : null,
    { event, shopifyProductIds: productIds },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess
    }
  );

  return {
    offer,
    offerLoading,
    offerError
  };
};

export default useRandomOffer;

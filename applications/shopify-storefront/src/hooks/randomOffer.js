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
  const offerViewed = offerViews.events.indexOf(event) > -1;
  const isLoadEvent = event === 'LOAD';
  const isExitEvent = event === 'EXIT';
  const isProductEvent = !!shopifyProductIds?.length;
  const shouldQuery = isLoadEvent || isExitEvent || isProductEvent;

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

  return { offer, product, offerViewed };
};

export default useRandomOffer;

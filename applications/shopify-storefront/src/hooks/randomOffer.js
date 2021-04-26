import { useState } from 'react';
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

  const [offerViews] = useState(getCookie('upsellingOfferViews') || []);

  const viewedOfferIds = offerViews.map((offerView) => offerView.offerId);
  const isLoadEvent = event === 'LOAD';
  const isExitEvent = event === 'EXIT';
  const isProductEvent = !!shopifyProductIds?.length;
  const shouldQuery = isLoadEvent || isExitEvent || isProductEvent;
  const params = qs.stringify(
    {
      event,
      shopifyProductIds,
      viewedOfferIds
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
  const { offer, popupTheme, triggerProduct, offeredProducts } = data || {};

  return {
    offer,
    popupTheme,
    triggerProduct,
    offeredProducts
  };
};

export default useRandomOffer;

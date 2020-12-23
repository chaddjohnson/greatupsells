import { useState, useEffect } from 'react';
import {
  useHttpClient,
  useCookies
} from '@neatowebsolutions/upselling-react-hooks';

const useRandomOffer = ({ event, productIds }) => {
  const [offer, setOffer] = useState(null);
  const [product, setProduct] = useState(null);

  const { httpClient } = useHttpClient();
  const { getCookie } = useCookies();

  const offerViews = getCookie('upsellingOfferViews') || {
    events: [],
    offers: []
  };

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
    (shopifyProductId) => `shopifyProductIds[]=${shopifyProductId}`
  );

  useEffect(() => {
    if (!shouldQuery) {
      return;
    }

    (async () => {
      const offerData = await httpClient.get(
        `/offers/random?event=${event}&${shopifyProductIdsParam}`
      );
      const productData = await httpClient.get(
        `/offers/${offerData._id}/products/random`
      );

      setOffer(offerData);
      setProduct(productData);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { offer, product };
};

export default useRandomOffer;

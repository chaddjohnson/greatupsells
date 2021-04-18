import { useState } from 'react';
import {
  useHttpClient,
  useCookies
} from '@neatowebsolutions/upselling-react-hooks';

const useOfferTracking = () => {
  const [offerHitId, setOfferHitId] = useState(null);

  const { httpClient } = useHttpClient();
  const { getCookie, setCookie } = useCookies();

  const trackOfferView = async (
    offerId,
    triggerEvent,
    triggerShopifyProductId,
    shopifyProductIds,
    shopifyVariantIds
  ) => {
    // Retrieve local event and offer tracking data.
    const offerViews = getCookie('upsellingOfferViews') || { events: [] };

    // Track whether an offer has shown for the event.
    if (!offerViews.events.indexOf(triggerEvent) > -1) {
      offerViews.events.push(triggerEvent);

      // Save the offer view.
      setCookie('upsellingOfferViews', offerViews, {
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 1 day
      });
    }

    // Record an offer hit.
    const offerHit = await httpClient.post(`/offers/${offerId}/views`, {
      triggerShopifyProductId,
      shopifyProductIds,
      shopifyVariantIds
    });

    // Keep track of the newly-created offer hit.
    setOfferHitId(offerHit._id);
  };

  const trackOfferAcceptance = async (
    offerId,
    shopifyProductId,
    shopifyVariantId,
    quantity
  ) => {
    await httpClient.post(`/offers/${offerId}/acceptances`, {
      offerHitId,
      shopifyProductId,
      shopifyVariantId,
      quantity
    });
  };

  // NOTE: Conversion tracking occurs in order creation webhook.

  return { trackOfferView, trackOfferAcceptance };
};

export default useOfferTracking;

import { useState } from 'react';
import { useMutation } from '@neatowebsolutions/upselling-graphql-client';
import {
  TRACK_OFFER_VIEW_MUTATION,
  // TRACK_OFFER_ACCEPTANCE_MUTATION,
  TRACK_OFFER_ACCEPTANCE_MUTATION
} from '@neatowebsolutions/upselling-graphql-queries';
import useCookies from './cookies';

const useOfferTracking = () => {
  const [offerHitId, setOfferHitId] = useState(null);

  const { getCookie, setCookie } = useCookies();

  const trackView = useMutation(TRACK_OFFER_VIEW_MUTATION);
  const trackAcceptance = useMutation(TRACK_OFFER_ACCEPTANCE_MUTATION);

  const trackOfferView = async (
    offerId,
    triggerEvent,
    productId,
    variantId
  ) => {
    // Record an offer hit.
    const offerHit = await trackView({ offerId, productId, variantId });

    // Retrieve local event and offer tracking data.
    const offerViews = getCookie('upsellingOfferViews') || {
      events: [],
      offers: []
    };

    // Keep track of the newly-created offer hit.
    setOfferHitId(offerHit._id);

    // Track the event and the offer locally.
    offerViews.events.push(triggerEvent);
    offerViews.offers.push(offerId);

    // Save the offer view.
    setCookie('upsellingOfferViews', offerViews, {
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 1 day
    });
  };

  const trackOfferAcceptance = async (productId, variantId, quantity) => {
    await trackAcceptance(offerHitId, productId, variantId, quantity);
  };

  // NOTE: Conversion tracking occurs in order creation webhook.

  return { trackOfferView, trackOfferAcceptance };
};

export default useOfferTracking;

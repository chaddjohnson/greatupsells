import { useState } from 'react';
import {
  useHttpClient,
  useCookies
} from '@neatowebsolutions/upselling-react-hooks';

const useOfferTracking = () => {
  const [offerHitId, setOfferHitId] = useState(null);

  const { httpClient } = useHttpClient();
  const { getCookie, setCookie } = useCookies();

  const trackOfferView = async ({
    offerId,
    triggerShopifyProductId = undefined,
    offeredShopifyProductIds = [],
    offeredShopifyVariantIds = []
  }) => {
    // Retrieve local event and offer tracking data.
    const offerViews = getCookie('upsellingOfferViews') || [];
    const sessionOfferViews = sessionStorage.upsellingSessionOfferViews
      ? JSON.parse(sessionStorage.upsellingSessionOfferViews)
      : [];
    const offerView = offerViews.find((current) => current.offerId === offerId);
    const sessionOfferView = sessionOfferViews.find(
      (current) => current.offerId === offerId
    );
    const viewedAt = new Date().toISOString();

    // Update existing offer view tracking, or add one if it does not exist.
    if (offerView) {
      offerView.viewedAt = viewedAt;
    } else {
      offerViews.push({ offerId, viewedAt });
    }

    // Track the offer view via cookie.
    setCookie('upsellingOfferViews', offerViews, {
      sameSite: 'Strict',
      maxAge: 60 * 60 * 24 // 1 day
    });

    // Update existing offer view session tracking, or add one if it does not exist.
    if (sessionOfferView) {
      sessionOfferView.viewedAt = viewedAt;
    } else {
      sessionOfferViews.push({ offerId, viewedAt });
    }

    // Track the offer view via sessionStorage.
    sessionStorage.upsellingSessionOfferViews = JSON.stringify(
      sessionOfferViews
    );

    // Record an offer hit.
    const offerHit = await httpClient.post(`/offers/${offerId}/views`, {
      triggerShopifyProductId,
      offeredShopifyProductIds,
      offeredShopifyVariantIds
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

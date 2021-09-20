import {
  useHttpClient,
  useCookies
} from '@neatowebsolutions/upselling-react-hooks';

// Intentionally track offer hit ID at module level as this hook may be used in
// multiple places, and state won't be shared.
let offerHitId = '';

const useOfferTracking = () => {
  const { httpClient } = useHttpClient();
  const { getCookie, setCookie } = useCookies();

  const trackOfferImpression = async ({
    offerId,
    triggerShopifyProductId = undefined,
    offeredShopifyProductIds = []
  }) => {
    // Retrieve local event and offer tracking data.
    const offerImpressions = getCookie('upsellingOfferImpressions') || [];
    const sessionOfferImpressions = sessionStorage.upsellingSessionOfferImpressions
      ? JSON.parse(sessionStorage.upsellingSessionOfferImpressions)
      : [];
    const offerImpression = offerImpressions.find(
      (current) => current.offerId === offerId
    );
    const sessionOfferImpression = sessionOfferImpressions.find(
      (current) => current.offerId === offerId
    );
    const viewedAt = new Date().toISOString();

    // Update existing offer impression tracking, or add one if it does not exist.
    if (offerImpression) {
      offerImpression.viewedAt = viewedAt;
    } else {
      offerImpressions.push({ offerId, viewedAt });
    }

    // Update existing offer impression session tracking, or add one if it does not exist.
    if (sessionOfferImpression) {
      sessionOfferImpression.viewedAt = viewedAt;
    } else {
      sessionOfferImpressions.push({ offerId, viewedAt });
    }

    // Track the offer impression via cookie.
    setCookie('upsellingOfferImpressions', offerImpressions, {
      sameSite: 'Strict',
      maxAge: 60 * 60 * 24 // 1 day
    });

    // Track the offer impression via sessionStorage.
    sessionStorage.upsellingSessionOfferImpressions = JSON.stringify(
      sessionOfferImpressions
    );

    // Record an offer hit.
    const offerHit = await httpClient.post(`/offers/${offerId}/impressions`, {
      triggerShopifyProductId,
      offeredShopifyProductIds
    });

    console.log(offerHit);

    // Keep track of the newly-created offer hit.
    offerHitId = offerHit._id;
  };

  const trackOfferAcceptance = async (
    offerId,
    shopifyProductId,
    shopifyVariantId,
    quantity
  ) => {
    const offerHit = await httpClient.post(`/offers/${offerId}/acceptances`, {
      offerHitId,
      shopifyProductId,
      shopifyVariantId,
      quantity
    });

    return offerHit;
  };

  // NOTE: Conversion tracking occurs in order creation webhook.

  return { trackOfferImpression, trackOfferAcceptance };
};

export default useOfferTracking;

import { useCookies, useHttpClient } from '@greatupsells/react-hooks';

const queryString = new URLSearchParams(window.location.search);
const testToken = queryString.get('testToken');
const isTest = !!testToken;

// Intentionally track offer hit ID at module level as this hook may be used in
// multiple places, and we want this state to be shared.
let offerHitId = '';

const useOfferTracking = () => {
  const { httpClient } = useHttpClient();
  const { getCookie, setCookie } = useCookies();

  const trackOfferImpression = async ({
    offerId,
    triggerShopifyProductId = undefined,
    triggerShopifyVariantId = undefined,
    offeredShopifyProductIds = []
  }) => {
    // Retrieve local event and offer tracking data.
    const offerImpressions = getCookie('greatupsellsOfferImpressions') || [];
    const sessionOfferImpressions = sessionStorage.greatupsellsSessionOfferImpressions
      ? JSON.parse(sessionStorage.greatupsellsSessionOfferImpressions)
      : [];
    const offerImpression = offerImpressions.find((current) => current.offerId === offerId);
    const sessionOfferImpression = sessionOfferImpressions.find((current) => current.offerId === offerId);
    const viewedAt = new Date().toISOString();

    // Do not track views on the client side when testing offers.
    if (!isTest) {
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
      setCookie('greatupsellsOfferImpressions', offerImpressions, {
        sameSite: 'Strict',
        maxAge: ((60 * 60 * 24 * 365) / 12) * 3 // 3 months
      });

      // Track the offer impression via sessionStorage.
      sessionStorage.greatupsellsSessionOfferImpressions = JSON.stringify(sessionOfferImpressions);
    }

    // Record an offer hit.
    const offerHit = await httpClient.post(`/offers/${offerId}/impressions`, {
      triggerShopifyProductId,
      triggerShopifyVariantId,
      offeredShopifyProductIds,
      isTest
    });

    // Keep track of the newly-created offer hit.
    offerHitId = offerHit._id;
  };

  const trackOfferAcceptance = async (offerId, items, shopifyDraftOrderId) => {
    const offerHit = await httpClient.post(`/offers/${offerId}/acceptances`, {
      offerHitId,
      items,
      shopifyDraftOrderId
    });

    return offerHit;
  };

  // NOTE: Conversion tracking occurs in order creation webhook.

  return { trackOfferImpression, trackOfferAcceptance };
};

export default useOfferTracking;

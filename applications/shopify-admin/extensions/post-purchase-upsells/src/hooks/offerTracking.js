const STOREFRONT_API_URL = process.env.STOREFRONT_API_URL; // eslint-disable-line prefer-destructuring

// Intentionally track offer hit ID at module level as this hook may be used in
// multiple places, and we want this state to be shared.
let offerHitId = '';

const useOfferTracking = () => {
  const trackOfferImpression = async ({
    domain,
    offerId,
    triggerShopifyProductId = undefined,
    triggerShopifyVariantId = undefined,
    offeredShopifyProductIds = []
  }) => {
    const url = `${STOREFRONT_API_URL}/offers/${offerId}/impressions`;
    const data = {
      triggerShopifyProductId,
      triggerShopifyVariantId,
      offeredShopifyProductIds
    };

    // Record an offer hit.
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        shop: `https://${domain}`
      },
      body: JSON.stringify(data)
    });
    const offerHit = await response.json();

    // Keep track of the newly-created offer hit.
    offerHitId = offerHit._id;
  };

  const trackOfferAcceptance = async (offerId, items, shopifyCheckoutId) => {
    const url = `${STOREFRONT_API_URL}/offers/${offerId}/acceptances`;
    const data = { offerHitId, items, shopifyCheckoutId };
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const offerHit = await response.json();

    return offerHit;
  };

  return { trackOfferImpression, trackOfferAcceptance };
};

export default useOfferTracking;

const logger = require('@greatupsells/logger');
const models = require('..');

const trackAcceptance = async (offerHit, items, { shopifyDraftOrderId, shopifyCheckoutId }) => {
  const [Offer, Shop] = await Promise.all([models.get('Offer'), models.get('Shop')]);

  await offerHit.populate('shop').populate('offer').execPopulate();

  const { shop, offer, isTest } = offerHit;
  const acceptanceTracked = offerHit.acceptedProducts.length > 0;
  const shopifyApiClient = shop.getShopifyApiClient();
  let shopifyOrderId;
  let shopifyCheckoutOrders = [];

  // Get the Shopify order ID from the Shopify checkout (if available).
  if (shopifyCheckoutId) {
    shopifyCheckoutOrders = await shopifyApiClient.order.list({ checkout_id: shopifyCheckoutId });
    shopifyOrderId = shopifyCheckoutOrders?.[0]?.id;
  }

  try {
    const promises = [];

    // Track products associated with this acceptance.
    promises.push(
      offerHit.trackAcceptedProducts(items, {
        shopifyDraftOrderId,
        shopifyOrderId
      })
    );

    // Track acceptance one time per offer hit (and not once per product per offer hit).
    if (!acceptanceTracked && !isTest) {
      // Increment offer acceptance count.
      promises.push(
        Offer.findByIdAndUpdate(offer.id, {
          $inc: {
            acceptanceCount: 1
          }
        })
      );

      // Increment shop offer acceptance count.
      promises.push(
        Shop.findByIdAndUpdate(shop.id, {
          $inc: {
            offerAcceptanceCount: 1
          }
        })
      );
    }

    // Run queries in parallel.
    await Promise.all(promises);
  } catch (error) {
    await logger.error(
      `Error tracking offer acceptance for offer hit (${
        offerHit && offerHit.toString()
      }) in shop (${shop && shop.toString()})`,
      error,
      { offer, offerHit }
    );

    throw error;
  }
};

module.exports = trackAcceptance;

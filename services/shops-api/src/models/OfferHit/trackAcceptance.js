const logger = require('@greatupsells/logger');
const mongodbClient = require('../mongodbClient');
const models = require('..');

const trackAcceptance = async (offerHit, items, { shopifyDraftOrderId, shopifyCheckoutId }) => {
  const [Offer, Shop, session] = await Promise.all([
    models.get('Offer'),
    models.get('Shop'),
    mongodbClient.connection.startSession()
  ]);

  await offerHit.populate('shop').populate('offer').execPopulate();

  const { shop, offer, isTest } = offerHit;
  const transactionOptions = { readPreference: 'primary' };
  const acceptanceTracked = offerHit.acceptedProducts.length > 0;
  const shopifyApiClient = shop.getShopifyApiClient();
  let shopifyOrderId;
  let shopifyCheckout = null;

  // Get the Shopify order ID from the Shopify checkout (if available).
  if (shopifyCheckoutId) {
    shopifyCheckout = await shopifyApiClient.checkout.get(shopifyCheckoutId);
    shopifyOrderId = shopifyCheckout.order_id;
  }

  try {
    // Use a transaction.
    await session.withTransaction(async () => {
      const promises = [];

      offerHit.$session(session);

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
          Offer.findByIdAndUpdate(
            offer.id,
            {
              $inc: {
                acceptanceCount: 1
              }
            },
            { session }
          )
        );

        // Increment shop offer acceptance count.
        promises.push(
          Shop.findByIdAndUpdate(
            shop.id,
            {
              $inc: {
                offerAcceptanceCount: 1
              }
            },
            { session }
          )
        );
      }

      // Run queries in parallel.
      await Promise.all(promises);
    }, transactionOptions);
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

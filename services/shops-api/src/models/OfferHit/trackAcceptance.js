const logger = require('@greatupsells/logger');
const mongodbClient = require('../mongodbClient');
const models = require('..');

const trackAcceptance = async (
  offerHit,
  shopifyDraftOrderId,
  shopifyProductId = undefined,
  shopifyVariantId = undefined,
  quantity = 0
) => {
  const [Offer, Shop, session] = await Promise.all([
    models.get('Offer'),
    models.get('Shop'),
    mongodbClient.connection.startSession()
  ]);

  await offerHit.populate('shop').populate('offer').execPopulate();

  const { shop, offer } = offerHit;
  const transactionOptions = { readPreference: 'primary' };
  const acceptanceTracked = offerHit.acceptedProducts.length > 0;

  try {
    // Use a transaction.
    await session.withTransaction(async () => {
      const promises = [];

      offerHit.$session(session);

      // If a product is associated with this acceptance, track it.
      if (shopifyProductId && shopifyVariantId) {
        promises.push(
          offerHit.trackAcceptedProduct(
            shopifyDraftOrderId,
            shopifyProductId,
            shopifyVariantId,
            quantity
          )
        );
      }

      // Track acceptance one time per offer hit (and not once per product per offer hit).
      if (!acceptanceTracked) {
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

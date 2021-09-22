const logger = require('@neatowebsolutions/upselling-logger');
const mongodbClient = require('../mongodbClient');
const models = require('..');

const trackAcceptance = async (
  offerHit,
  shopifyProductId = undefined,
  shopifyVariantId = undefined,
  quantity = 0
) => {
  await offerHit.populate('shop').populate('offer').execPopulate();

  const { shop, offer } = offerHit;
  const Offer = await models.get('Offer');
  const Shop = await models.get('Shop');

  const session = await mongodbClient.connection.startSession();
  const transactionOptions = { readPreference: 'primary' };
  const promises = [];

  try {
    // Use a transaction.
    await session.withTransaction(async () => {
      offerHit.$session(session);

      // If a product is associated with this acceptance, track it.
      if (shopifyProductId && shopifyVariantId) {
        promises.push(
          offerHit.trackAcceptedProduct(
            shopifyProductId,
            shopifyVariantId,
            quantity
          )
        );
      }

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
    }, transactionOptions);

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

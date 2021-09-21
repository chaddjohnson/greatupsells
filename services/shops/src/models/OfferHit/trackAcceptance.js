const logger = require('@neatowebsolutions/upselling-logger');
const mongodbClient = require('../mongodbClient');

const trackAcceptance = async (
  offerHit,
  shopifyProductId = undefined,
  shopifyVariantId = undefined,
  quantity = 0
) => {
  await offerHit.populate('shop').populate('offer').execPopulate();

  const { shop, offer } = offerHit;
  const Offer = offer.constructor;
  const Shop = shop.constructor;

  const session = await mongodbClient.connection.startSession();
  const transactionOptions = { readPreference: 'primary' };

  try {
    // Use a transaction.
    await session.withTransaction(async () => {
      offerHit.$session(session);

      offerHit.acceptedAt = offerHit.acceptedAt || Date.now();

      await offerHit.save();

      // If a product is associated with this acceptance, track it.
      if (shopifyProductId && shopifyVariantId) {
        await offerHit.trackAcceptedProduct(
          shopifyProductId,
          shopifyVariantId,
          quantity
        );
      }

      // Increment offer acceptance count.
      await Offer.findByIdAndUpdate(
        offer.id,
        {
          $inc: {
            acceptanceCount: 1
          }
        },
        { session }
      );

      // Increment shop offer acceptance count.
      await Shop.findByIdAndUpdate(
        shop.id,
        {
          $inc: {
            offerAcceptanceCount: 1
          }
        },
        { session }
      );
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

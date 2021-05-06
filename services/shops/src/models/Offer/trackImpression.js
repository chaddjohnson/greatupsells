const logger = require('@neatowebsolutions/upselling-logger');
const mongodbClient = require('../mongodbClient');

const trackImpression = async (
  offer,
  {
    triggerShopifyProductId = undefined,
    offeredShopifyProductIds = [],
    offeredShopifyVariantIds = [],
    ipAddress = undefined
  }
) => {
  await offer.execPopulate('shop');

  const { shop, shopifyShopId, strategy, triggerEvent } = offer;
  const Offer = offer.constructor;
  const Shop = shop.constructor;
  const OfferHit = mongodbClient.connection.model('OfferHit');
  const offerHit = new OfferHit({
    offer,
    shopifyShopId,
    shop,
    strategy,
    triggerEvent,
    triggerShopifyProductId,
    ipAddress
  });

  const session = await mongodbClient.connection.startSession();

  try {
    // Use a transaction.
    await session.withTransaction(async () => {
      offerHit.$session(session);

      await offerHit.save();

      if (offeredShopifyProductIds.length && offeredShopifyVariantIds.length) {
        await offerHit.trackOfferedProducts(
          offeredShopifyProductIds,
          offeredShopifyVariantIds
        );
      }

      // Increment offer impression count.
      await Offer.findByIdAndUpdate(
        offer.id,
        {
          $inc: {
            impressionCount: 1
          }
        },
        { session }
      );

      // Increment shop offer impression count.
      await Shop.findByIdAndUpdate(
        shop.id,
        {
          $inc: {
            offerImpressionCount: 1
          }
        },
        { session }
      );
    });

    return offerHit;
  } catch (error) {
    await logger.error(
      `Error tracking offer impression for offer (${
        offer && offer.toString()
      }) in shop (${shop && shop.toString()})`,
      error,
      offerHit,
      ipAddress
    );

    throw error;
  }
};

module.exports = trackImpression;

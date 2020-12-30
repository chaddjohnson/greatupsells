const logger = require('@neatowebsolutions/upselling-logger');
const mongodbClient = require('../mongodbClient');

const trackView = async (
  offer,
  shopifyProductId,
  shopifyVariantId,
  ipAddress
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
    triggerEvent,
    strategy,
    ipAddress
  });

  const session = await mongodbClient.connection.startSession();

  try {
    // Use a transaction.
    await session.withTransaction(async () => {
      offerHit.$session(session);

      await offerHit.save();

      if (shopifyProductId && shopifyVariantId) {
        await offerHit.trackOriginalProduct(shopifyProductId, shopifyVariantId);
      }

      // Increment offer view count.
      await Offer.findByIdAndUpdate(
        offer.id,
        {
          $inc: {
            viewCount: 1
          }
        },
        { session }
      );

      // Increment shop offer view count.
      await Shop.findByIdAndUpdate(
        shop.id,
        {
          $inc: {
            offerViewCount: 1
          }
        },
        { session }
      );
    });

    return offerHit;
  } catch (error) {
    logger.error(
      `Error tracking offer view for offer (${
        offer && offer.toString()
      }) in shop (${shop && shop.toString()})`,
      error,
      offerHit,
      ipAddress
    );

    throw error;
  }
};

module.exports = trackView;

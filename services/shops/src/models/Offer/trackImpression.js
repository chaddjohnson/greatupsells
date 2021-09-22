const logger = require('@neatowebsolutions/upselling-logger');
const mongodbClient = require('../mongodbClient');
const models = require('..');

const trackImpression = async (
  offer,
  {
    triggerShopifyProductId = undefined,
    offeredShopifyProductIds = [],
    ipAddress = undefined
  }
) => {
  await models.get('Shop');
  await offer.execPopulate('shop');

  const {
    shop,
    shopifyShopId,
    strategy,
    triggerEvent,
    triggerPagePath
  } = offer;
  const Offer = await models.get('Offer');
  const Shop = await models.get('Shop');
  const OfferHit = await models.get('OfferHit');
  const offerHit = new OfferHit({
    offer,
    shopifyShopId,
    shop,
    strategy,
    triggerEvent,
    triggerPagePath,
    triggerShopifyProductId,
    ipAddress
  });

  const session = await mongodbClient.connection.startSession();
  const transactionOptions = { readPreference: 'primary' };

  try {
    // Use a transaction.
    await session.withTransaction(async () => {
      offerHit.$session(session);

      await offerHit.save();

      if (offeredShopifyProductIds.length) {
        await offerHit.trackOfferedProducts(offeredShopifyProductIds);
      }

      // Increment offer impression count.
      await Offer.findByIdAndUpdate(
        offer.id,
        {
          $inc: {
            impressionCount: 1
          },
          conversionRate: offer.conversionCount / (offer.impressionCount + 1)
        },
        { session }
      );

      // Increment shop offer impression count.
      await Shop.findByIdAndUpdate(
        shop.id,
        {
          $inc: {
            offerImpressionCount: 1
          },
          offerConversionRate:
            shop.offerConversionCount / (shop.offerImpressionCount + 1)
        },
        { session }
      );
    }, transactionOptions);

    return offerHit;
  } catch (error) {
    await logger.error(
      `Error tracking offer impression for offer (${
        offer && offer.toString()
      }) in shop (${shop && shop.toString()})`,
      error,
      { offerHit, ipAddress }
    );

    throw error;
  }
};

module.exports = trackImpression;

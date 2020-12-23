const logger = require('@neatowebsolutions/upselling-logger');
const mongodbClient = require('../mongodbClient');
const calculateRevenueIncrease = require('./calculateRevenueIncrease');

const trackConversion = async (offerHit, order) => {
  await offerHit.populate('shop').populate('offer').execPopulate();

  const { shop, offer } = offerHit;
  const Offer = offer.constructor;

  const session = await mongodbClient.connection.startSession();

  try {
    // Use a transaction.
    await session.withTransaction(async () => {
      offerHit.$session(session);

      offerHit.convertedAt = Date.now();
      offerHit.order = order;
      offerHit.shopifyOrderId = order.shopifyOrderId;
      offerHit.shopifyOrderNumber = order.shopifyOrderNumber;
      offerHit.revenueIncrease = calculateRevenueIncrease(offerHit);

      await offerHit.save();

      // Update offer stats.
      await Offer.findByIdAndUpdate(
        offer.id,
        {
          $inc: {
            revenueIncrease: offerHit.revenueIncrease,
            conversionCount: 1
          },
          conversionRate: (offer.conversionCount + 1) / offer.viewCount
        },
        { session }
      );

      // Update shop stats.
      await shop.findByIdAndUpdate(
        shop.id,
        {
          $inc: {
            revenueIncrease: offerHit.revenueIncrease,
            offerConversionCount: 1
          },
          offerConversionRate:
            (shop.offerConversionCount + 1) / shop.offerViewCount
        },
        { session }
      );
    });
  } catch (error) {
    logger.error(
      `Error tracking offer conversion for offer hit (${
        offerHit && offerHit.toString()
      }) in shop (${shop && shop.toString()})`,
      error,
      offer,
      offerHit
    );
  }
};

module.exports = trackConversion;

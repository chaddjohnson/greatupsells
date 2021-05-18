const logger = require('@neatowebsolutions/upselling-logger');
const mongodbClient = require('../mongodbClient');
const calculateRevenueIncrease = require('./calculateRevenueIncrease');

const trackConversion = async (offerHit, order) => {
  await offerHit.populate('shop').populate('offer').execPopulate();

  const { shop, offer } = offerHit;
  const Offer = offer.constructor;
  const Product = mongodbClient.connection.model('Product');

  const session = order.$session();

  try {
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
        conversionRate: (offer.conversionCount + 1) / offer.impressionCount
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
          (shop.offerConversionCount + 1) / shop.offerImpressionCount
      },
      { session }
    );

    // Remove copied products associated with this order.
    await Promise.allSettled(
      offerHit.acceptedProducts.map(async ({ shopifyProductId }) => {
        await Product.findOneAndDelete(
          {
            shopifyProductId,
            originalShopifyProductId: { $ne: null } // Require this field, just to be safe.
          },
          { session }
        );
      })
    );
  } catch (error) {
    await logger.error(
      `Error tracking offer conversion for offer hit (${
        offerHit && offerHit.toString()
      }) in shop (${shop && shop.toString()})`,
      error,
      offer,
      offerHit
    );
    throw error;
  }
};

module.exports = trackConversion;

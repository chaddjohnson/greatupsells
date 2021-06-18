const logger = require('@neatowebsolutions/upselling-logger');
const mongodbClient = require('../mongodbClient');
const calculateRevenueIncrease = require('./calculateRevenueIncrease');

const trackConversion = async (offerHit, order) => {
  await offerHit.populate('shop').populate('offer').execPopulate();

  const { shop, offer } = offerHit;
  const Offer = offer.constructor;
  const Shop = shop.constructor;
  const Product = mongodbClient.connection.model('Product');
  const shopifyApiClient = shop.getShopifyApiClient();

  const session = order.$session();

  try {
    offerHit.$session(session);

    offerHit.convertedAt = Date.now();
    offerHit.order = order;
    offerHit.shopifyOrderId = order.shopifyOrderId;
    offerHit.shopifyOrderNumber = order.shopifyOrderNumber;
    offerHit.revenueIncrease = calculateRevenueIncrease(offerHit);

    logger.info(
      `Tracking conversion for order ${
        order.orderNumber
      } for shop (${shop.toString()})`,
      { offerHit }
    );

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
    await Shop.findByIdAndUpdate(
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
  } catch (error) {
    await logger.error(
      `Error tracking offer conversion for offer hit (${
        offerHit && offerHit.toString()
      }) in shop (${shop && shop.toString()})`,
      error,
      { offer, offerHit }
    );
    throw error;
  }
};

module.exports = trackConversion;

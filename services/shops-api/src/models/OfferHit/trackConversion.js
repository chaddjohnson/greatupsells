const logger = require('@neatowebsolutions/greatupsells-logger');
const calculateRevenueIncrease = require('./calculateRevenueIncrease');
const models = require('..');

const trackConversion = async (offerHit, order) => {
  const [Offer, Shop, session] = await Promise.all([
    models.get('Offer'),
    models.get('Shop'),
    order.$session()
  ]);

  await offerHit.populate('shop').populate('offer').execPopulate();

  const { shop, offer } = offerHit;

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

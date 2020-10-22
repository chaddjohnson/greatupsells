const logger = require('@neatowebsolutions/logger');
const calculateRevenueIncrease = require('./calculateRevenueIncrease');

const trackConversion = async (offerHit, order) => {
  await offerHit.populate('shop').populate('offer').execPopulate();

  const { shop, offer } = offerHit;
  const Offer = offer.constructor;

  try {
    offerHit.convertedAt = Date.now();
    offerHit.shopifyOrderId = order.shopifyOrderId;
    offerHit.shopifyOrderNumber = order.shopifyOrderNumber;
    offerHit.revenueIncrease = calculateRevenueIncrease(offerHit);

    await offerHit.save();

    // Update offer stats.
    await Offer.findByIdAndUpdate(offer.id, {
      $inc: {
        revenueIncrease: offerHit.revenueIncrease,
        conversionCount: 1
      },
      conversionRate: (offer.conversionCount + 1) / offer.viewCount
    });

    // Update shop stats.
    await shop.findByIdAndUpdate(shop.id, {
      $inc: {
        revenueIncrease: offerHit.revenueIncrease,
        conversionCount: 1
      },
      conversionRate: (shop.conversionCount + 1) / shop.viewCount
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

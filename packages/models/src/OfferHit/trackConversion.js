const logger = require('@neatowebsolutions/logger');
const calculateRevenueIncrease = require('./calculateRevenueIncrease');

const trackConversion = async (offerHit, order) => {
  await offerHit.populate('shop').populate('offer').execPopulate();

  const { shop, offer } = offerHit;

  try {
    offerHit.convertedAt = Date.now();
    offerHit.shopifyOrderId = order.shopifyOrderId;
    offerHit.shopifyOrderNumber = order.shopifyOrderNumber;
    offerHit.revenueIncrease = calculateRevenueIncrease(offerHit);

    await offerHit.save();
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

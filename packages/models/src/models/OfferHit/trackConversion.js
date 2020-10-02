const logger = require('@neatowebsolutions/logger');
const calculateRevenueIncrease = require('./calculateRevenueIncrease');
const models = require('..');

const trackConversion = async (offerHit, order) => {
  const Offer = await models.get('Offer');
  const offer = await Offer.findById(offerHit.offer);
  const { shop } = offer;

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

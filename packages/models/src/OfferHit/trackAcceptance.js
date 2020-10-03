const logger = require('@neatowebsolutions/logger');

const trackAcceptance = async (offerHit, productId, variantId, quantity) => {
  const models = require('..');
  const Offer = await models.get('Offer');
  const offer = await Offer.findById(offerHit.offer).populate('shop');
  const { shop } = offer;

  // If a product is associated with this acceptance, track it.
  if (productId && variantId) {
    await offerHit.trackAcceptedProduct(productId, variantId, quantity);
  }

  offerHit.acceptedAt = Date.now();

  try {
    await offerHit.save();
  } catch (error) {
    logger.error(
      `Error tracking offer acceptance for offer hit (${
        offerHit && offerHit.toString()
      }) in shop (${shop && shop.toString()})`,
      error,
      offer,
      offerHit
    );

    throw error;
  }
};

module.exports = trackAcceptance;

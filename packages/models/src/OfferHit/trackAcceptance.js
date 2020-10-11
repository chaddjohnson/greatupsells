const logger = require('@neatowebsolutions/logger');

const trackAcceptance = async (
  offerHit,
  shopifyProductId,
  shopifyVariantId,
  quantity
) => {
  const models = require('..');
  const Offer = await models.get('Offer');
  const offer = await Offer.findById(offerHit.offer).populate('shop');
  const { shop } = offer;

  try {
    offerHit.acceptedAt = Date.now();

    await offerHit.save();

    // If a product is associated with this acceptance, track it.
    if (shopifyProductId && shopifyVariantId) {
      await offerHit.trackAcceptedProduct(
        shopifyProductId,
        shopifyVariantId,
        quantity
      );
    }
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

const logger = require('@neatowebsolutions/logger');

const trackAcceptance = async (
  offerHit,
  shopifyProductId,
  shopifyVariantId,
  quantity
) => {
  await offerHit.populate('shop').populate('offer').execPopulate();

  const { shop, offer } = offerHit;
  const Offer = offer.constructor;
  const Shop = shop.constructor;

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

    // Increment offer acceptance count.
    await Offer.findByIdAndUpdate(offer.id, {
      $inc: {
        acceptanceCount: 1
      }
    });

    // Increment shop offer acceptance count.
    await Shop.findByIdAndUpdate(shop.id, {
      $inc: {
        acceptanceCount: 1
      }
    });
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

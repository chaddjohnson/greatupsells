const logger = require('@neatowebsolutions/logger');

const trackView = async (
  offer,
  shopifyProductId,
  shopifyVariantId,
  ipAddress
) => {
  await offer.execPopulate('shop');

  const models = require('..');
  const { shop, shopifyShopId, strategy, triggerEvent } = offer;
  const OfferHit = await models.get('OfferHit');
  const offerHit = new OfferHit({
    offer,
    shopifyShopId,
    shop,
    triggerEvent,
    strategy,
    ipAddress
  });

  try {
    await offerHit.save();

    if (shopifyProductId && shopifyVariantId) {
      await offerHit.trackOriginalProduct(shopifyProductId, shopifyVariantId);
    }
  } catch (error) {
    logger.error(
      `Error tracking offer view for offer (${
        offer && offer.toString()
      }) in shop (${shop && shop.toString()})`,
      error,
      offerHit,
      ipAddress
    );

    throw error;
  }
};

module.exports = trackView;

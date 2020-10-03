const logger = require('@neatowebsolutions/logger');

const trackView = async (
  offer,
  shopifyProductId,
  shopifyVariantId,
  ipAddress
) => {
  const models = require('..');
  const Shop = await models.get('Shop');
  const shop = await Shop.findById(offer.shop);
  const { shopifyShopId, strategy, triggerEvent } = offer;
  const OfferHit = await models.get('OfferHit');
  const offerHit = new OfferHit({
    offer,
    shopifyShopId,
    shop,
    triggerEvent,
    strategy,
    ipAddress
  });

  if (shopifyProductId && shopifyVariantId) {
    await offerHit.trackOriginalProduct(shopifyProductId, shopifyVariantId);
  }

  try {
    await offerHit.save();
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

const logger = require('@neatowebsolutions/logger');

const trackView = async (offer, productId, variantId, ipAddress) => {
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

  if (productId && variantId) {
    await offerHit.trackOriginalProduct(productId, variantId);
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

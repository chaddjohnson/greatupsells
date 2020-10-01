const logger = require('@neatowebsolutions/logger');
const models = require('..');

const trackView = async (offer, productId, variantId, ipAddress) => {
  const { shopifyShopId, shop, strategy, triggerEvent } = offer;
  const OfferHit = await models.get('OfferHit');
  const Product = await models.get('Product');
  const offerHit = new OfferHit({
    offer,
    shopifyShopId,
    shop,
    triggerEvent,
    strategy,
    ipAddress
  });
  let offeredShopifyProductVariant = null;

  if (productId && variantId) {
    offeredShopifyProductVariant = await Product.findShopifyProductVariant(
      productId,
      variantId
    );

    offerHit.offeredShopifyProductId = productId;
    offerHit.offeredShopifyProductVariantId = variantId;
    offerHit.offeredShopifyProductVariantPrice =
      offeredShopifyProductVariant &&
      (parseFloat(offeredShopifyProductVariant.price) || 0);
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
  }
};

module.exports = trackView;

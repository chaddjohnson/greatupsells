const logger = require('@greatupsells/logger');
const models = require('..');

const trackImpression = async (
  offer,
  {
    triggerShopifyProductId = undefined,
    triggerShopifyVariantId = undefined,
    offeredShopifyProductIds = [],
    ipAddress = undefined,
    isTest = false
  }
) => {
  const [Offer, Shop, OfferHit] = await Promise.all([models.get('Offer'), models.get('Shop'), models.get('OfferHit')]);

  await offer.execPopulate('shop');

  const { shop, shopifyShopId, strategy, triggerEvent, triggerPagePath } = offer;
  const triggerProduct = triggerShopifyProductId &&
    triggerShopifyVariantId && {
      shopifyProductId: triggerShopifyProductId,
      shopifyVariantId: triggerShopifyVariantId
    };
  const offerHit = new OfferHit({
    offer,
    shopifyShopId,
    shop,
    strategy,
    triggerEvent,
    triggerPagePath,
    triggerProduct,
    ipAddress,
    isTest
  });

  try {
    await offerHit.save();

    if (offeredShopifyProductIds.length) {
      await offerHit.trackOfferedProducts(offeredShopifyProductIds);
    }

    if (!isTest) {
      // Increment offer impression count.
      await Offer.findByIdAndUpdate(offer.id, {
        $inc: {
          impressionCount: 1
        },
        conversionRate: offer.conversionCount / (offer.impressionCount + 1)
      });

      // Increment shop offer impression count.
      await Shop.findByIdAndUpdate(shop.id, {
        $inc: {
          offerImpressionCount: 1
        },
        offerConversionRate: shop.offerConversionCount / (shop.offerImpressionCount + 1)
      });
    }

    return offerHit;
  } catch (error) {
    await logger.error(
      `Error tracking offer impression for offer (${offer && offer.toString()}) in shop (${shop && shop.toString()})`,
      error,
      { offerHit, ipAddress }
    );

    throw error;
  }
};

module.exports = trackImpression;

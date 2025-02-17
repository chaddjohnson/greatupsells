const models = require('..');

const trackOfferedProducts = async (offerHit, shopifyProductIds = []) => {
  const OfferHit = await models.get('OfferHit');
  const session = await offerHit.$session();

  // Track the viewed product data for the offer hit.
  const offeredProducts = shopifyProductIds.map((shopifyProductId) => ({
    shopifyProductId
  }));

  await OfferHit.findByIdAndUpdate(offerHit.id, { offeredProducts }, { session });
};

module.exports = trackOfferedProducts;

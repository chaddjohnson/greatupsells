const findRandomOffer = async (shop, shopifyProductIds) => {
  const models = require('..');
  const Offer = await models.get('Offer');

  // TODO: Look up collection IDs for products, and pass those along?

  return Offer.findRandomByShopifyProductIds(shop, shopifyProductIds);
};

module.exports = findRandomOffer;

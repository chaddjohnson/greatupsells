const mongodbClient = require('../mongodbClient');

const findRandomOffer = async (shop, shopifyProductIds) => {
  const Offer = mongodbClient.connection.model('Offer');

  // TODO: Look up collection IDs for products, and pass those along?

  // TODO: Ensure the user hasn't seen the offer recently?

  return Offer.findRandomByShopifyProductIds(shop, shopifyProductIds);
};

module.exports = findRandomOffer;

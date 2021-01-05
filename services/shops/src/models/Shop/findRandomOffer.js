const mongodbClient = require('../mongodbClient');

const findRandomOffer = async (shop, triggerEvent, shopifyProductIds) => {
  const shopifyProductIdsMissing =
    (triggerEvent === 'LOAD' || triggerEvent === 'EXIT') &&
    (!shopifyProductIds || shopifyProductIds.length === 0);

  if (!triggerEvent) {
    throw new Error('`triggerEvent` must be provided');
  }
  if (shopifyProductIdsMissing) {
    throw new Error(
      `\`shopifyProductIds\` must be provided for trigger event ${triggerEvent}`
    );
  }

  const Offer = mongodbClient.connection.model('Offer');

  // TODO: Look up collection IDs for products, and pass those along?

  // TODO: Ensure the user hasn't seen the offer recently?

  return Offer.findRandomByShopifyProductIds(shop, shopifyProductIds);
};

module.exports = findRandomOffer;

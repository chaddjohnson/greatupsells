const mongodbClient = require('../mongodbClient');

const findRandomOffer = async (shop, triggerEvent, shopifyProductIds) => {
  const shopifyProductIdsRequired =
    triggerEvent === 'ADD' ||
    triggerEvent === 'CART' ||
    triggerEvent === 'CHECKOUT';
  const shopifyProductIdsMissing =
    shopifyProductIdsRequired &&
    (!shopifyProductIds || shopifyProductIds.length === 0);

  if (!shop) {
    throw new Error('`shop` must be provided');
  }
  if (!triggerEvent) {
    throw new Error('`triggerEvent` must be provided');
  }
  if (shopifyProductIdsMissing) {
    throw new Error(
      `\`shopifyProductIds\` must be provided with trigger event ${triggerEvent}`
    );
  }

  const Offer = mongodbClient.connection.model('Offer');

  return await Offer.findOneRandom(shop, triggerEvent, shopifyProductIds);
};

module.exports = findRandomOffer;

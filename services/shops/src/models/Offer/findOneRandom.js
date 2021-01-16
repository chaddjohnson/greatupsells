const mongodbClient = require('../mongodbClient');

const findOneRandomByTriggerEvent = async (shop, triggerEvent) => {
  const Offer = mongodbClient.connection.model('Offer');

  // Randomly find an offer having the trigger event as a trigger.
  const offers = await Offer.aggregate([
    {
      $match: {
        shop: shop._id,
        triggerEvent,
        enabled: true
      }
    },
    { $sample: { size: 1 } }
  ]);
  const offer = offers[0];

  return offer;
};

const findOneRandomByTriggerEventAndShopifyProductIds = async (
  shop,
  triggerEvent,
  shopifyProductIds
) => {
  const Collection = mongodbClient.connection.model('Collection');
  const Offer = mongodbClient.connection.model('Offer');
  const collections = await Collection.find({
    shopifyProductIds: { $in: shopifyProductIds }
  });
  const shopifyCollectionIds = collections.map(
    ({ shopifyCollectionId }) => shopifyCollectionId
  );

  // Randomly select an offer having the trigger event as a trigger AND [one of
  // the Shopify products as a trigger OR a collection to which one or more
  // of the products belong as a trigger].
  const offers = await Offer.aggregate([
    {
      $match: {
        shop: shop._id,
        triggerEvent,
        $or: [
          {
            'triggerProducts.shopifyProductId': {
              $in: shopifyProductIds
            }
          },
          {
            'triggerCollections.shopifyCollectionId': {
              $in: shopifyCollectionIds
            }
          }
        ],
        enabled: true
      }
    },
    { $sample: { size: 1 } }
  ]);
  const offer = offers[0];

  return offer;
};

const findOneRandom = async (shop, triggerEvent, shopifyProductIds) => {
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

  if (shopifyProductIdsRequired) {
    return await findOneRandomByTriggerEventAndShopifyProductIds(
      shop,
      triggerEvent,
      shopifyProductIds
    );
  } else {
    return await findOneRandomByTriggerEvent(shop, triggerEvent);
  }
};

module.exports = findOneRandom;

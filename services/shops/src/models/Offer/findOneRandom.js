const geoip = require('geoip-country');
const mongodbClient = require('../mongodbClient');

const findOneRandomByTriggerEvent = async (shop, triggerEvent, ipAddress) => {
  const Offer = mongodbClient.connection.model('Offer');
  const geoData =
    !!ipAddress && ipAddress !== '127.0.0.1' && geoip.lookup(ipAddress);
  const criteria = {
    shop: shop._id,
    triggerEvent,
    enabled: true
  };

  // Limit to offers with no geotargeting AND offers targeting the country that
  // the IP address resolves to.
  if (geoData) {
    criteria.$or = [
      { enableGeotargeting: false },
      { geotargetingCountries: geoData.country }
    ];
  }

  // Randomly find an offer having the trigger event as a trigger.
  const randomOffers = await Offer.aggregate([
    { $match: criteria },
    { $sample: { size: 1 } },
    {
      $project: {
        _id: 1
      }
    }
  ]);
  const randomOffer = randomOffers[0];

  if (!randomOffer || !randomOffer._id) {
    return;
  }

  // Aggregation only returns JSON, so query for a Mongoose document.
  return await Offer.findById(randomOffer._id).populate('popupTheme');
};

const findOneRandomByTriggerEventAndShopifyProductIds = async (
  shop,
  triggerEvent,
  shopifyProductIds,
  ipAddress
) => {
  shopifyProductIds = shopifyProductIds.map((shopifyProductId) =>
    parseInt(shopifyProductId)
  );

  const Collection = mongodbClient.connection.model('Collection');
  const Offer = mongodbClient.connection.model('Offer');
  const geoData =
    !!ipAddress && ipAddress !== '127.0.0.1' && geoip.lookup(ipAddress);
  const collections = await Collection.find({
    shopifyProductIds: { $in: shopifyProductIds }
  });
  const shopifyCollectionIds = collections.map(
    ({ shopifyCollectionId }) => shopifyCollectionId
  );

  const criteria = {
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
  };

  // Limit to offers with no geotargeting AND offers targeting the country that
  // the IP address resolves to.
  if (geoData) {
    criteria.$or = [
      { enableGeotargeting: false },
      { geotargetingCountries: geoData.country }
    ];
  }

  // Randomly select an offer having the trigger event as a trigger AND [one of
  // the Shopify products as a trigger OR a collection to which one or more
  // of the products belong as a trigger].
  const randomOffers = await Offer.aggregate([
    { $match: criteria },
    { $sample: { size: 1 } },
    {
      $project: {
        _id: 1
      }
    }
  ]);
  const randomOffer = randomOffers[0];

  if (!randomOffer || !randomOffer._id) {
    return;
  }

  // Aggregation only returns JSON, so query for a Mongoose document.
  return await Offer.findById(randomOffer._id).populate('popupTheme');
};

const findOneRandom = async (
  shop,
  triggerEvent,
  shopifyProductIds,
  ipAddress
) => {
  const shopifyProductIdsRequired =
    triggerEvent === 'ADD' || triggerEvent === 'CART';
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
      shopifyProductIds,
      ipAddress
    );
  } else {
    return await findOneRandomByTriggerEvent(shop, triggerEvent, ipAddress);
  }
};

module.exports = findOneRandom;

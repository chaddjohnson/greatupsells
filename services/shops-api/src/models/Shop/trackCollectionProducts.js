const logger = require('@greatupsells/logger');
const models = require('..');

const trackCollectionProducts = async (shop) => {
  const Collection = await models.get('Collection');
  const criteria = {
    shop: shop._id
  };
  const cursor = Collection.find(criteria).cursor({ batchSize: 100 });

  cursor.addCursorFlag('noCursorTimeout', true);

  await cursor.eachAsync(async (collection) => {
    try {
      await collection.trackShopifyProducts();
    } catch (error) {
      await logger.warn(`Error tracking Shopify products for collection ${collection.id}`);
    }
  });
};

module.exports = trackCollectionProducts;

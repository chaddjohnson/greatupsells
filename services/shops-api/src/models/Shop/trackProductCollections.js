const logger = require('@greatupsells/logger');
const models = require('..');

const trackProductCollections = async (shop) => {
  const Product = await models.get('Product');
  const criteria = {
    shop: shop._id
  };
  const cursor = Product.find(criteria).cursor({ batchSize: 100 });

  cursor.addCursorFlag('noCursorTimeout', true);

  await cursor.eachAsync(async (product) => {
    try {
      await product.trackShopifyCollections();
    } catch (error) {
      await logger.warn(`Error tracking Shopify collections for product ${product.id}`);
    }
  });
};

module.exports = trackProductCollections;

const moment = require('moment-timezone');
const mongodbClient = require('../mongodbClient');

module.exports = async () => {
  const Product = mongodbClient.connection.model('Product');

  // Keep copied products for three months to match how long abandoned
  // checkouts are kept.
  const criteria = {
    'shopifyProductData.product_type': 'upsellcrosssell',
    createdAt: {
      $lte: moment().utc().subtract(3, 'months').toDate()
    }
  };

  const cursor = Product.find(criteria)
    .populate('shop')
    .cursor({ batchSize: 50 });

  await cursor.eachAsync(
    async (product) => {
      const { shop, shopifyShopId } = product;
      const shopifyApiClient = shop.getShopifyApiClient();

      // Remove the product from Shopify. The product will then be marked as
      // deleted (but not deleted) via webhook.
      await shopifyApiClient.delete(shopifyShopId);
    },
    { parallel: 25 }
  );
};

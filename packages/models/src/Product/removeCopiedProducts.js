const moment = require('moment-timezone');
const models = require('..');

module.exports = async () => {
  const Product = await models.get('Product');

  const criteria = {
    'shopifyProductData.product_type': 'upsellcrosssell',
    createdAt: {
      $lte: moment().utc().subtract(3, 'days').toDate()
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

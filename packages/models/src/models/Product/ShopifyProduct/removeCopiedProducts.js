const moment = require('moment-timezone');

module.exports = async () => {
  const models = require('../..');
  const ShopifyProduct = await models.get('ShopifyProduct');

  const criteria = {
    'shopifyProductData.product_type': 'upsellcrosssell',
    createdAt: {
      $lte: moment().utc().subtract(3, 'days').toDate()
    }
  };

  const cursor = ShopifyProduct.find(criteria).cursor({ batchSize: 50 });

  await cursor.eachAsync(async (product) => {
    const { shop, platformShopId } = product;
    const shopifyApiClient = shop.getShopifyApiClient();

    // Remove the product from Shopify.
    await shopifyApiClient.delete(platformShopId);

    // Remove the product from our database.
    await product.remove();
  });
};

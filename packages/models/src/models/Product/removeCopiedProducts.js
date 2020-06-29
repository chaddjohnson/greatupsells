const moment = require('moment-timezone');

module.exports = async () => {
  const models = require('..');
  const Product = await models.get('Product');

  const criteria = {
    'shopifyProductData.product_type': 'upsellcrosssell',
    createdAt: {
      $lte: moment().utc().subtract(3, 'days').toDate()
    }
  };

  const cursor = Product.find(criteria).cursor({ batchSize: 50 });

  await cursor.eachAsync(async (product) => {
    const { shop, shopifyShopId } = product;
    const shopifyApiClient = shop.getShopifyApiClient();

    // Remove the product from Shopify.
    await shopifyApiClient.delete(shopifyShopId);

    // Remove the product from our database.
    await product.remove();
  });
};

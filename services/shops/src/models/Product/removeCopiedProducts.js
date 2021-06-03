const { DateTime } = require('luxon');
const mongodbClient = require('../mongodbClient');

const removeCopiedProducts = async () => {
  const Product = mongodbClient.connection.model('Product');

  // Keep copied products for three months to match how long abandoned
  // checkouts are kept.
  const criteria = {
    originalShopifyProductId: { $ne: null },
    createdAt: {
      $lte: DateTime.utc().minus({ months: 3 }).toJSDate()
    }
  };

  const cursor = Product.find(criteria)
    .populate('shop')
    .cursor({ batchSize: 50 });

  cursor.addCursorFlag('noCursorTimeout', true);

  await cursor.eachAsync(async (product) => {
    const { shop, shopifyShopId } = product;
    const shopifyApiClient = shop.getShopifyApiClient();

    // Remove the product from Shopify. The product will then be marked as
    // deleted (but not deleted) via webhook.
    await shopifyApiClient.product.delete(shopifyShopId);
  });
};

module.exports = removeCopiedProducts;

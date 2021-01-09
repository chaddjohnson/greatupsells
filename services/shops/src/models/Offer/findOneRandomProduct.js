const mongodbClient = require('../mongodbClient');

const findOneRandomProduct = async (offer) => {
  // Return no product if the offer has neither product nor collection triggers.
  if (offer.products.length === 0 && offer.shopifyCollectionIds.length === 0) {
    return;
  }

  await offer.execPopulate('shop');

  const Product = mongodbClient.connection.model('Product');
  const {
    shop,
    products: triggerProducts,
    collections: triggerCollections
  } = offer;
  const triggerShopifyProductIds = triggerProducts.map(
    (triggerProduct) => triggerProduct.shopifyProductId
  );
  const triggerShopifyCollectionIds = triggerCollections.map(
    (triggerCollection) => triggerCollection.shopifyCollectionId
  );

  // Randomly select a product that is a trigger for the offer OR a product in a collection
  // that is a trigger for the offer.
  const products = await Product.aggregate([
    {
      $match: {
        shop: shop._id,
        $or: [
          { shopifyProductId: { $in: triggerShopifyProductIds } },
          { shopifyCollectionIds: { $in: triggerShopifyCollectionIds } }
        ]
      }
    },
    { $sample: { size: 1 } }
  ]);
  const product = products[0];

  return product;
};

module.exports = findOneRandomProduct;

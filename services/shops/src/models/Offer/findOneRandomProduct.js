const mongodbClient = require('../mongodbClient');

const findOneRandomProduct = async (offer) => {
  const { shop, offeredProducts, offeredCollections } = offer;

  // Return no product if the offer has neither products nor collections.
  if (offeredProducts.length === 0 && offeredCollections.length === 0) {
    return;
  }

  const Product = mongodbClient.connection.model('Product');
  const offeredShopifyProductIds = offeredProducts.map(
    ({ shopifyProductId }) => shopifyProductId
  );
  const offeredShopifyCollectionIds = offeredCollections.map(
    ({ shopifyCollectionId }) => shopifyCollectionId
  );

  await offer.execPopulate('shop');

  // Randomly select a product for the offer OR a product in a collection for the offer.
  const randomProducts = await Product.aggregate([
    {
      $match: {
        shop: shop._id,
        $or: [
          { shopifyProductId: { $in: offeredShopifyProductIds } },
          { shopifyCollectionIds: { $in: offeredShopifyCollectionIds } }
        ],
        'shopifyProductData.published_at': { $ne: null }
      }
    },
    { $sample: { size: 1 } }
  ]);
  const randomProduct = randomProducts[0];

  return randomProduct;
};

module.exports = findOneRandomProduct;

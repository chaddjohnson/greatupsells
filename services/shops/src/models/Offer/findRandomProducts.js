const mongodbClient = require('../mongodbClient');

const findRandomProducts = async (offer) => {
  await offer.execPopulate('shop');

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
    {
      $sample: {
        size: 3
      }
    },
    {
      $project: {
        _id: 1
      }
    }
  ]);

  if (!randomProducts || !randomProducts[0] || !randomProducts[0]._id) {
    return [];
  }

  // Aggregation only returns JSON, so query for Mongoose documents.
  // return await Product.findById(randomProduct._id);
  return await Promise.all(
    randomProducts.map(async ({ _id }) => Product.findById(_id))
  );
};

module.exports = findRandomProducts;

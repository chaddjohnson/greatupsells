const mongodbClient = require('../mongodbClient');

const trackCollectionProducts = async (collection) => {
  const { shop, shopifyCollectionId } = collection;
  const shopifyApiClient = shop.getShopifyApiClient();

  // Get a list of products belonging to this collection.
  // TODO: Deal with pagination.
  const shopifyProducts = await shopifyApiClient.collection.products(
    shopifyCollectionId,
    { fields: 'id' }
  );
  const shopifyProductIds = shopifyProducts.map(({ id }) => id);

  // Track the products for the collection.
  collection.shopifyProductIds = shopifyProductIds;
  collection.productCount = collection.shopifyProductIds.length;
  collection.markModified('shopifyProductIds');

  await collection.save();
};

const trackProductCollections = async (collection) => {
  const Product = mongodbClient.connection.model('Product');
  const { shopifyCollectionId } = collection;
  // const products = await Promise.all(
  //   collection.shopifyProductIds.map(Product.findByShopifyProductId)
  // );
  const products = await Product.find({
    shopifyProductId: { $in: collection.shopifyProductIds }
  });

  await Promise.all(
    products.map(async (product) => {
      if (!product.shopifyCollectionIds.includes(shopifyCollectionId)) {
        product.shopifyCollectionIds.push(shopifyCollectionId);
        product.markModified('shopifyCollectionIds');
        await product.save();
      }
    })
  );
};

const trackShopifyProducts = async (collection) => {
  await collection.execPopulate('shop');

  // Update `collection.shopifyProductIds` for the collection.
  await trackCollectionProducts(collection);

  // Update `product.shopifyCollectionIds` for collection products.
  await trackProductCollections(collection);
};

module.exports = trackShopifyProducts;

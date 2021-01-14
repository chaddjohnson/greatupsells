const mongodbClient = require('../mongodbClient');

const getShopifyProductIds = async (collection) => {
  const { shop, shopifyCollectionId } = collection;
  const shopifyApiClient = shop.getShopifyApiClient();
  let params = {
    limit: 250,
    fields: 'id'
  };
  let shopifyProductIds = [];

  // Handle pagination.
  do {
    // eslint-disable-next-line no-await-in-loop
    const shopifyProducts = await shopifyApiClient.collection.products(
      shopifyCollectionId,
      params
    );

    shopifyProductIds = shopifyProductIds.concat(
      shopifyProducts.map(({ id }) => id)
    );
    params = shopifyProducts.nextPageParameters;
  } while (params);

  return shopifyProductIds;
};

const trackCollectionProducts = async (collection) => {
  // Get a list of products belonging to this collection.
  const shopifyProductIds = await getShopifyProductIds(collection);

  // Track the products for the collection.
  collection.shopifyProductIds = shopifyProductIds;
  collection.productCount = collection.shopifyProductIds.length;
  collection.markModified('shopifyProductIds');

  await collection.save();
};

const trackProductCollections = async (collection) => {
  const Product = mongodbClient.connection.model('Product');
  const { shopifyCollectionId } = collection;
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

  // Track products for the collection.
  await trackCollectionProducts(collection);

  // Track collections for the product.
  await trackProductCollections(collection);
};

module.exports = trackShopifyProducts;

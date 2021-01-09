const mongodbClient = require('../mongodbClient');

const getShopifyCollectionIds = async (product) => {
  const { shop, shopifyProductId } = product;
  const shopifyApiClient = shop.getShopifyApiClient();

  // Get a list of manual collections this product belongs to.
  // TODO: Deal with pagination.
  const collects = await shopifyApiClient.collect.list({
    product_id: shopifyProductId,
    fields: 'collection_id'
  });
  const manualCollectionIds = collects.map((collect) => collect.collection_id);

  // Get a list of smart collections the product belongs to.
  // TODO: Deal with pagination.
  const smartCollections = await shopifyApiClient.smartCollection.list({
    product_id: shopifyProductId,
    fields: 'id'
  });
  const smartCollectionIds = smartCollections.map(({ id }) => id);

  // Combine manual and smart collection IDs.
  const shopifyCollectionIds = manualCollectionIds.concat(smartCollectionIds);

  return shopifyCollectionIds;
};

const addProductToCollections = async (product, collections) => {
  const { shopifyProductId } = product;

  await Promise.all(
    collections.map(async (collection) => {
      if (!collection.shopifyProductIds.includes(shopifyProductId)) {
        collection.shopifyProductIds.push(shopifyProductId);
        collection.markModified('shopifyProductIds');
        await collection.save();
      }
    })
  );
};

const trackShopifyCollections = async (product) => {
  await product.execPopulate('shop');

  const Collection = mongodbClient.connection.model('Collection');
  const shopifyCollectionIds = await getShopifyCollectionIds(product);

  // Get all referenced collections.
  const collections = await Collection.find({
    shopifyCollectionId: { $in: shopifyCollectionIds }
  });

  // Track the collections for the product.
  product.shopifyCollectionIds = shopifyCollectionIds;
  product.markModified('shopifyCollectionIds');
  await product.save();

  // Update the collections to reference the product.
  await addProductToCollections(product, collections);
};

module.exports = trackShopifyCollections;

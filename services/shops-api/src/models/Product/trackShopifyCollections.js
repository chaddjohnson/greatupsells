const models = require('..');

const getManualCollectionIds = async (product) => {
  const { shop, shopifyProductId } = product;
  const shopifyApiClient = shop.getShopifyApiClient();
  let params = {
    product_id: shopifyProductId,
    limit: 250,
    fields: 'collection_id'
  };
  let manualCollectionIds = [];

  // Handle pagination.
  do {
    // eslint-disable-next-line no-await-in-loop
    const collects = await shopifyApiClient.collect.list(params);

    manualCollectionIds = manualCollectionIds.concat(
      collects.map((collect) => collect.collection_id)
    );
    params = collects.nextPageParameters;
  } while (params);

  return manualCollectionIds;
};

const getSmartCollectionIds = async (product) => {
  const { shop, shopifyProductId } = product;
  const shopifyApiClient = shop.getShopifyApiClient();
  let params = {
    product_id: shopifyProductId,
    fields: 'id'
  };
  let smartCollectionIds = [];

  // Handle pagination.
  do {
    // eslint-disable-next-line no-await-in-loop
    const smartCollections = await shopifyApiClient.smartCollection.list(
      params
    );

    smartCollectionIds = smartCollectionIds.concat(
      smartCollections.map(({ id }) => id)
    );
    params = smartCollections.nextPageParameters;
  } while (params);

  return smartCollectionIds;
};

const getShopifyCollectionIds = async (product) => {
  // Get a list of manual collections this product belongs to.
  const manualCollectionIds = await getManualCollectionIds(product);

  // Get a list of smart collections the product belongs to.
  const smartCollectionIds = await getSmartCollectionIds(product);

  // Combine manual and smart collection IDs.
  const shopifyCollectionIds = manualCollectionIds.concat(smartCollectionIds);

  return shopifyCollectionIds;
};

const addProductToCollections = async (product, collections) => {
  const Collection = await models.get('Collection');
  const { shopifyProductId } = product;

  await Promise.all(
    collections.map(async (collection) => {
      const shopifyProductIds = collection.shopifyProductIds || [];

      if (!shopifyProductIds.includes(shopifyProductId)) {
        shopifyProductIds.push(shopifyProductId);

        await Collection.findByIdAndUpdate(collection.id, {
          shopifyProductIds
        });
      }
    })
  );
};

const trackShopifyCollections = async (product) => {
  const [Product, Collection] = await Promise.all([
    models.get('Product'),
    models.get('Collection'),
    models.get('Shop')
  ]);

  await product.execPopulate('shop');

  const shopifyCollectionIds = await getShopifyCollectionIds(product);

  // Get all referenced collections.
  const collections = await Collection.find({
    shopifyCollectionId: { $in: shopifyCollectionIds }
  });

  // Track the collections for the product.
  await Product.findByIdAndUpdate(product.id, { shopifyCollectionIds });

  // Update the collections to reference the product.
  await addProductToCollections(product, collections);
};

module.exports = trackShopifyCollections;

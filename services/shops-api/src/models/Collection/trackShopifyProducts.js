const models = require('..');

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
  const Collection = await models.get('Collection');

  // Get a list of products belonging to this collection.
  const shopifyProductIds = await getShopifyProductIds(collection);
  const productCount = collection.shopifyProductIds.length;

  // Track the products for the collection.
  await Collection.findByIdAndUpdate(collection.id, {
    shopifyProductIds,
    productCount
  });
};

const trackProductCollections = async (collection) => {
  const Product = await models.get('Product');
  const { shopifyCollectionId } = collection;
  const products = await Product.find({
    shopifyProductId: { $in: collection.shopifyProductIds }
  });

  await Promise.all(
    products.map(async (product) => {
      const shopifyCollectionIds = product.shopifyCollectionIds || [];

      if (!shopifyCollectionIds.includes(shopifyCollectionId)) {
        shopifyCollectionIds.push(shopifyCollectionId);

        await Product.findByIdAndUpdate(product.id, { shopifyCollectionIds });
      }
    })
  );
};

const trackShopifyProducts = async (collection) => {
  await models.get('Shop');
  await collection.execPopulate('shop');

  // Track products for the collection.
  await trackCollectionProducts(collection);

  // Track collection for the products.
  await trackProductCollections(collection);
};

module.exports = trackShopifyProducts;

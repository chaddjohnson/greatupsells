const Promise = require('bluebird');
const logger = require('@neatowebsolutions/greatupsells-logger');
const models = require('..');

const importCollection = async (shop, shopifyCollectionData) => {
  try {
    const Collection = await models.get('Collection');
    const { shopifyShopId } = shop;
    const shopifyCollectionId = shopifyCollectionData.id;
    let collection = await Collection.findOneByShopifyCollectionId(
      shopifyCollectionData.id
    );

    if (collection) {
      collection.shopifyCollectionData = shopifyCollectionData;
    } else {
      collection = new Collection({
        shop,
        shopifyShopId,
        shopifyCollectionId,
        shopifyCollectionData
      });

      await logger.info(
        `Imported collection from Shopify (${collection.toString()})`,
        { shopifyCollectionData }
      );
    }

    await collection.save();
    await collection.trackShopifyProducts();
  } catch (error) {
    await logger.warn(
      `Error importing Shopify collection ${
        shopifyCollectionData.id
      } for shop (${shop.toString()})`,
      error
    );
  }
};

const importCustomCollections = async (shop) => {
  const shopifyApiClient = shop.getShopifyApiClient();
  let params = { limit: 100 };

  // Handle pagination.
  do {
    // eslint-disable-next-line no-await-in-loop
    const shopifyCollections = await shopifyApiClient.customCollection.list(
      params
    );

    // eslint-disable-next-line no-await-in-loop
    await Promise.mapSeries(
      shopifyCollections,
      async (shopifyCollectionData) => {
        await importCollection(shop, shopifyCollectionData);
      }
    );

    params = shopifyCollections.nextPageParameters;
  } while (params);
};

const importSmartCollections = async (shop) => {
  const shopifyApiClient = shop.getShopifyApiClient();
  let params = { limit: 100 };

  // Handle pagination.
  do {
    // eslint-disable-next-line no-await-in-loop
    const shopifyCollections = await shopifyApiClient.smartCollection.list(
      params
    );

    // eslint-disable-next-line no-await-in-loop
    await Promise.mapSeries(
      shopifyCollections,
      async (shopifyCollectionData) => {
        await importCollection(shop, shopifyCollectionData);
      }
    );

    params = shopifyCollections.nextPageParameters;
  } while (params);
};

const importCollections = async (shop) => {
  await importCustomCollections(shop);
  await importSmartCollections(shop);
};

module.exports = importCollections;

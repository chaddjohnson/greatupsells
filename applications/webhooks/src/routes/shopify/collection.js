const { StatusCodes } = require('http-status-codes');
const models = require('@neatowebsolutions/upselling-models');
const logger = require('@neatowebsolutions/logger');

const handler = async (request, response) => {
  const domain = request.headers['x-shopify-shop-domain'];
  const data = request.body;
  const Collection = await models.get('Collection');
  const Shop = await models.get('Shop');
  const shop = await Shop.findByDomain(domain);
  const shopifyApiClient = shop.getShopifyApiClient();
  const shopifyCollectionId = data.id;
  let collection = await Collection.findByShopifyCollectionId(
    shopifyCollectionId
  );
  let productCount = 0;
  const dataIsNewer =
    !!collection &&
    new Date(data.updated_at) >
      new Date(collection.shopifyCollectionData.updated_at);

  // Track product count for manual (non-smart) collections.
  if (!data.rules) {
    productCount = await shopifyApiClient.collect.count({
      collection_id: shopifyCollectionId
    });
  }

  if (!collection) {
    try {
      collection = await Collection.create({
        shop,
        shopifyShopId: shop.shopifyShopId,
        shopifyCollectionId,
        shopifyCollectionData: data,
        productCount
      });

      logger.debug(
        `Collection created (${collection.toString()}) via webhook`,
        data,
        `${collection.productCount} associated products`
      );
    } catch (error) {
      logger.error(
        `Error creating collection for shop (${shop.toString()})`,
        error,
        data
      );
    }
  } else {
    try {
      // Update if the incoming data is newer than what is saved.
      if (dataIsNewer) {
        await collection.execPopulate('shop');

        // Update local Shopify data for the collection.
        collection.shopifyCollectionData = data;
        collection.productCount = productCount;

        await collection.save();

        logger.debug(
          `Collection updated (${collection.toString()}) via webhook`,
          data,
          `${collection.productCount} associated products`
        );
      }
    } catch (error) {
      logger.error(
        `Error updating collection (${collection.toString()}) for shop (${shop.toString()})`,
        error,
        data
      );
    }
  }

  response.status(StatusCodes.OK).end();
};

module.exports = handler;

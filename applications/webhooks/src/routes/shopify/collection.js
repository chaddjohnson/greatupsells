const { StatusCodes } = require('http-status-codes');
const models = require('@neatowebsolutions/upselling-models');
const logger = require('@neatowebsolutions/upselling-logger');

const handler = async (request, response) => {
  const domain = request.headers['x-shopify-shop-domain'];
  const data = request.body;
  const Collection = await models.get('Collection');
  const Shop = await models.get('Shop');
  const shop = await Shop.findByDomain(domain);
  const shopifyCollectionId = data.id;
  let collection = await Collection.findByShopifyCollectionId(
    shopifyCollectionId
  );
  const dataIsNewer =
    !collection ||
    !collection.shopifyCollectionData ||
    new Date(data.updated_at) >
      new Date(collection.shopifyCollectionData.updated_at);

  if (!collection) {
    try {
      collection = await Collection.create({
        shop,
        shopifyShopId: shop.shopifyShopId,
        shopifyCollectionId,
        shopifyCollectionData: data
      });
      await collection.trackShopifyProducts();

      logger.debug(
        `Collection created (${collection.toString()}) via webhook`,
        data
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

        await collection.save();
        await collection.trackShopifyProducts();

        logger.debug(
          `Collection updated (${collection.toString()}) via webhook`,
          data
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

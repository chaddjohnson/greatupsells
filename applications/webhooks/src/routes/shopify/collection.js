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
  const dataIsNewer =
    !!collection &&
    new Date(data.updated_at) >
      new Date(collection.shopifyCollectionData.updated_at);

  // Respond immediately so that Shopify does not consider this webhook as timed out.
  response.status(StatusCodes.OK).end();

  if (!collection) {
    try {
      collection = await Collection.create({
        shop,
        shopifyShopId: shop.shopifyShopId,
        shopifyCollectionId,
        shopifyCollectionData: data,
        productCount: await shopifyApiClient.collect.count({
          collection_id: shopifyCollectionId
        })
      });
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
        // Update local Shopify data for the collection.
        collection.shopifyCollectionData = data;
        collection.productCount = await shopifyApiClient.collect.count({
          collection_id: shopifyCollectionId
        });

        await collection.save();
      }
    } catch (error) {
      logger.error(
        `Error updating collection (${collection.toString()}) for shop (${shop.toString()})`,
        error,
        data
      );
    }
  }
};

module.exports = handler;

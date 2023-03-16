const HttpClient = require('@greatupsells/gateway-http-client');
const logger = require('@greatupsells/logger');
const { getMetadataValue, handle } = require('../lib/worker');

const { SHOPS_API_URL } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

const processor = async (metadata, payload) => {
  let collection = null;

  try {
    const topic = getMetadataValue(metadata, 'X-Shopify-Topic');
    const domain = getMetadataValue(metadata, 'X-Shopify-Shop-Domain');
    const shopifyCollectionData = payload;
    const shop = await httpClient.get(`/shops/domain/${domain}`);

    collection = await httpClient.get(
      `/collections/shopify-collection-id/${shopifyCollectionData.id}`
    );

    await logger.info(
      `Deleting collection "${collection.title}" for shop ${shop.domain} via ${topic} webhook`,
      { metadata, payload }
    );

    await httpClient.delete(`/collections/${collection._id}`);
  } catch (error) {
    if (!collection) {
      return;
    }

    await logger.error(
      `Error processing collection deletion webhook data`,
      error,
      { metadata, payload }
    );
  }
};

const handler = async (event, context) => {
  return await handle(event, context, processor);
};

module.exports.handler = handler;

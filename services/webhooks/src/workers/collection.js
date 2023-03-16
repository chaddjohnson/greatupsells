const HttpClient = require('@greatupsells/gateway-http-client');
const logger = require('@greatupsells/logger');
const { getMetadataValue, handle } = require('../lib/worker');

const { SHOPS_API_URL } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

const processor = async (metadata, payload) => {
  try {
    const domain = getMetadataValue(metadata, 'X-Shopify-Shop-Domain');
    const shopifyCollectionData = payload;
    const shopifyCollectionId = shopifyCollectionData.id;
    const shop = await httpClient.get(`/shops/domain/${domain}`);
    const { shopifyShopId } = shop;
    let collection = null;
    let dataIsNewer = false;

    try {
      collection = await httpClient.get(
        `/collections/shopify-collection-id/${shopifyCollectionId}`
      );
      dataIsNewer =
        !collection.shopifyCollectionData ||
        new Date(shopifyCollectionData.updated_at) >
          new Date(collection.shopifyCollectionData.updated_at);

      if (dataIsNewer) {
        collection.shopifyCollectionData = shopifyCollectionData;

        await httpClient.put(`/collections/${collection._id}`, collection);
      }
    } catch (error) {
      await httpClient.post('/collections', {
        shop: shop._id,
        shopifyShopId,
        shopifyCollectionId,
        shopifyCollectionData
      });
    }
  } catch (error) {
    await logger.error(`Error processing collection webhook data`, error, {
      metadata,
      payload
    });
  }
};

const handler = async (event, context) => {
  return await handle(event, context, processor);
};

module.exports.handler = handler;

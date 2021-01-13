const HttpClient = require('@neatowebsolutions/upselling-http-client');
const logger = require('@neatowebsolutions/upselling-logger');

const { SHOPS_API_URL } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

const processRecord = async (record) => {
  try {
    const { detail } = JSON.parse(record.body);
    const { metadata, payload, errors } = detail;

    if (errors) {
      return logger.error(`Error handling collection webhook`, errors, record);
    }

    const shopifyCollectionData = payload.collection;
    const shopifyCollectionId = shopifyCollectionData.id;
    const domain = metadata['X-Shopify-Shop-Domain'];
    const shop = await httpClient.get(`/shops/domain/${domain}`);
    const { shopifyShopId } = shop;
    const collection = await httpClient.get(
      `/collections/shopify-collection-id/${shopifyCollectionId}`
    );
    const dataIsNewer =
      !collection ||
      !collection.shopifyCollectionData ||
      new Date(shopifyCollectionData.updated_at) >
        new Date(collection.shopifyCollectionData.updated_at);

    if (!collection) {
      logger.debug(`Creating collection via webhook`, record);

      await httpClient.post('/collections', {
        shop: shop._id,
        shopifyShopId,
        shopifyCollectionId,
        shopifyCollectionData
      });
    } else if (dataIsNewer) {
      logger.debug(`Updating collection via webhook`, record);

      collection.shopifyCollectionData = shopifyCollectionData;

      await httpClient.put(`/collections/${collection._id}`, collection);
    }
  } catch (error) {
    logger.error(`Error handling collection webhook`, error, record);
  }
};

const handler = async (event) => {
  await Promise.all(event.Records.map(processRecord));
};

module.exports = handler;

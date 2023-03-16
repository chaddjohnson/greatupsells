const HttpClient = require('@greatupsells/gateway-http-client');
const logger = require('@greatupsells/logger');
const { getMetadataValue, handle } = require('../lib/worker');

const { SHOPS_API_URL } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

const processor = async (metadata, payload) => {
  try {
    const topic = getMetadataValue(metadata, 'X-Shopify-Topic');
    const domain = getMetadataValue(metadata, 'X-Shopify-Shop-Domain');
    const shopifyShopData = payload;
    const shop = await httpClient.get(`/shops/domain/${domain}`);

    await logger.info(`Updating shop ${shop.domain} via ${topic} webhook`, {
      metadata,
      payload
    });

    shop.shopifyShopData = shopifyShopData;

    await httpClient.put(`/shops/${shop._id}`, shop);
  } catch (error) {
    await logger.error(`Error processing shop webhook data`, error, {
      metadata,
      payload
    });
  }
};

const handler = async (event, context) => {
  return await handle(event, context, processor);
};

module.exports.handler = handler;

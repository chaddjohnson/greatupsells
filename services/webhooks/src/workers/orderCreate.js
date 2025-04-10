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
    const shopifyOrderData = payload;
    const shopifyOrderId = shopifyOrderData.id;
    const shopifyOrderNumber = shopifyOrderData.order_number;
    const shop = await httpClient.get(`/shops/domain/${domain}`);
    const { shopifyShopId } = shop;

    // Track the order if it is not already tracked.
    try {
      await httpClient.get(`/orders/shopify-order-id/${shopifyOrderId}`);
    } catch (error) {
      await httpClient.post('/orders', {
        shop: shop._id,
        shopifyShopId,
        shopifyOrderId,
        shopifyOrderNumber,
        shopifyOrderData
      });
    }
  } catch (error) {
    await logger.error(`Error processing order create webhook data`, error, {
      metadata,
      payload
    });
  }
};

const handler = async (event, context) => {
  return await handle(event, context, processor);
};

module.exports.handler = handler;

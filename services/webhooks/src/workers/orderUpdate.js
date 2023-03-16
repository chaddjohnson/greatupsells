const HttpClient = require('@greatupsells/gateway-http-client');
const logger = require('@greatupsells/logger');
const { handle } = require('../lib/worker');

const { SHOPS_API_URL } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

const processor = async (metadata, payload) => {
  let order = null;

  try {
    const shopifyOrderData = payload;
    const shopifyOrderId = shopifyOrderData.id;
    let dataIsNewer = false;

    order = await httpClient.get(`/orders/shopify-order-id/${shopifyOrderId}`);
    dataIsNewer =
      !order.shopifyOrderData ||
      new Date(shopifyOrderData.updated_at) >
        new Date(order.shopifyOrderData.updated_at);

    if (dataIsNewer) {
      order.shopifyOrderData = shopifyOrderData;

      await httpClient.put(`/orders/${order._id}`, order);
    }
  } catch (error) {
    if (!order) {
      return;
    }

    await logger.error(`Error processing order update webhook data`, error, {
      metadata,
      payload
    });
  }
};

const handler = async (event, context) => {
  return await handle(event, context, processor);
};

module.exports.handler = handler;

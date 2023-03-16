const HttpClient = require('@greatupsells/gateway-http-client');
const logger = require('@greatupsells/logger');
const { getMetadataValue, handle } = require('../lib/worker');

const { SHOPS_API_URL } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

const processor = async (metadata, payload) => {
  let order = null;

  try {
    const topic = getMetadataValue(metadata, 'X-Shopify-Topic');
    const shopifyOrderData = payload;

    order = await httpClient.get(
      `/orders/shopify-order-id/${shopifyOrderData.id}`
    );

    order.shopifyOrderData = shopifyOrderData;

    await httpClient.put(`/orders/${order._id}`, order);

    // Only cancel if the order is not marked as canceled.
    if (order && !order.canceledAt) {
      await logger.info(
        `Canceling order ${order.orderNumber} via ${topic} webhook`,
        { metadata, payload }
      );

      await httpClient.post(`/orders/${order._id}/cancelation`);
    }
  } catch (error) {
    if (!order) {
      return;
    }

    await logger.error(`Error processing order cancel webhook data`, error, {
      metadata,
      payload
    });
  }
};

const handler = async (event, context) => {
  return await handle(event, context, processor);
};

module.exports.handler = handler;

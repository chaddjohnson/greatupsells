const {
  checkWebhookHmacValidity,
  createRawBody
} = require('shopify-hmac-validation');
const HttpClient = require('@neatowebsolutions/upselling-http-client');
const logger = require('@neatowebsolutions/upselling-logger');

const { SHOPS_API_URL, SHOPIFY_ADMIN_API_SECRET_KEY } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

const processRecord = async (record) => {
  try {
    const body = JSON.parse(record.body);
    const { detail } = body;
    const { payload, metadata, errors } = detail;

    if (errors) {
      return await logger.error(
        `Error handling order cancelation via webhook`,
        errors,
        record
      );
    }

    const hmac = metadata['X-Shopify-Hmac-SHA256'];
    const hmacValid = checkWebhookHmacValidity(
      SHOPIFY_ADMIN_API_SECRET_KEY,
      createRawBody(payload),
      hmac
    );

    if (!hmacValid) {
      return await logger.error('Invalid HMAC for webhook', record);
    }

    const shopifyOrderData = payload;
    const order = await httpClient.get(
      `/orders/shopify-order-id/${shopifyOrderData.id}`
    );

    if (!order) {
      return;
    }

    await logger.debug(
      `Updating order ${order.orderNumber} via webhook`,
      record
    );

    order.shopifyOrderData = shopifyOrderData;

    await httpClient.put(`/orders/${order._id}`, order);

    // Only cancel if the order is not marked as canceled.
    if (order && !order.canceledAt) {
      await logger.info(
        `Canceling order ${order.orderNumber} via webhook`,
        record
      );

      await httpClient.post(`/orders/${order._id}/cancelation`);
    }
  } catch (error) {
    await logger.error(
      `Error handling order update via webhook`,
      error,
      record
    );
  }
};

const handler = async (event) => {
  await Promise.all(event.Records.map(processRecord));
};

module.exports = handler;

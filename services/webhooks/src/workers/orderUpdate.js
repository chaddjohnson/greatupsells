const {
  checkWebhookHmacValidity,
  createRawBody
} = require('shopify-hmac-validation');
const { aws4Interceptor } = require('aws4-axios');
const HttpClient = require('@neatowebsolutions/upselling-http-client');
const logger = require('@neatowebsolutions/upselling-logger');

const { AWS_REGION, SHOPS_API_URL, SHOPIFY_ADMIN_API_SECRET_KEY } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

httpClient.addRequestInterceptor(
  aws4Interceptor({
    region: AWS_REGION,
    service: 'execute-api'
  })
);

const processRecord = async (record) => {
  try {
    const body = JSON.parse(record.body);
    const { detail } = body;
    const { payload, metadata, errors } = detail;

    if (errors) {
      return await logger.error(
        `Error handling order update webhook`,
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
    const shopifyOrderId = shopifyOrderData.id;
    const order = await httpClient.get(
      `/orders/shopify-order-id/${shopifyOrderId}`
    );
    const dataIsNewer =
      !order ||
      !order.shopifyOrderData ||
      new Date(shopifyOrderData.updated_at) >
        new Date(order.shopifyOrderData.updated_at);

    if (order && dataIsNewer) {
      await logger.debug(
        `Updating order ${order.orderNumber} via webhook`,
        record
      );

      order.shopifyOrderData = shopifyOrderData;

      await httpClient.put(`/orders/${order._id}`, order);
    }
  } catch (error) {
    await logger.error(`Error handling order update webhook`, error, record);
  }
};

const handler = async (event) => {
  await Promise.all(event.Records.map(processRecord));
};

module.exports = handler;

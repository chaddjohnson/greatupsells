const {
  checkWebhookHmacValidity,
  createRawBody
} = require('shopify-hmac-validation');
const { aws4Interceptor } = require('aws4-axios');
const HttpClient = require('@neatowebsolutions/upselling-http-client').default;
const logger = require('@neatowebsolutions/upselling-logger');

const {
  AWS_REGION,
  SHOPS_API_URL,
  SHOPIFY_ADMIN_APP_API_SECRET_KEY
} = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

httpClient.addRequestInterceptor(
  aws4Interceptor({
    region: AWS_REGION,
    service: 'execute-api'
  })
);

const processData = async (metadata, data, rawData) => {
  let order = null;

  try {
    const hmac = metadata['X-Shopify-Hmac-Sha256'];
    const hmacValid = checkWebhookHmacValidity(
      SHOPIFY_ADMIN_APP_API_SECRET_KEY,
      rawData,
      hmac
    );

    if (!hmacValid) {
      await logger.error('Invalid HMAC for webhook', metadata);
    }

    const shopifyOrderData = data;

    order = await httpClient.get(
      `/orders/shopify-order-id/${shopifyOrderData.id}`
    );

    order.shopifyOrderData = shopifyOrderData;

    await httpClient.put(`/orders/${order._id}`, order);

    // Only cancel if the order is not marked as canceled.
    if (order && !order.canceledAt) {
      await logger.info(
        `Canceling order ${order.orderNumber} via webhook`,
        metadata,
        data
      );

      await httpClient.post(`/orders/${order._id}/cancelation`);
    }
  } catch (error) {
    if (!order) {
      return;
    }

    await logger.error(
      `Error processing order cancel webhook data`,
      error,
      metadata,
      data
    );
  }
};

const processRecord = async (record) => {
  const body = JSON.parse(record.body);
  const { detail } = body;
  const { payload, metadata, errors } = detail;

  if (errors) {
    return await logger.error(
      `Error processing order cancelation webhook record`,
      errors,
      record
    );
  }

  await processData(metadata, payload, createRawBody(payload));
};

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.Records) {
    // SQS (production).
    await Promise.allSettled(event.Records.map(processRecord));
  } else {
    // HTTP (development).
    await processData(event.headers, JSON.parse(event.body), event.body);
  }
};

module.exports.handler = handler;

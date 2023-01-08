const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const {
  checkWebhookHmacValidity,
  createRawBody
} = require('shopify-hmac-validation');
const HttpClient = require('@greatupsells/gateway-http-client');
const logger = require('@greatupsells/logger');
const { getMetadataValue } = require('../lib');

const { SHOPS_API_URL, SHOPIFY_ADMIN_APP_API_SECRET_KEY } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

const processData = async (metadata, data, rawBody) => {
  let order = null;

  try {
    const hmac = getMetadataValue(metadata, 'X-Shopify-Hmac-SHA256');
    const hmacValid = checkWebhookHmacValidity(
      SHOPIFY_ADMIN_APP_API_SECRET_KEY,
      rawBody,
      hmac
    );
    const topic = getMetadataValue(metadata, 'X-Shopify-Topic');

    if (!hmacValid) {
      await logger.error(`Invalid HMAC for ${topic} webhook`, null, {
        metadata,
        data
      });
    }

    const shopifyOrderData = data;
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
      data
    });
  }
};

const processRecord = async (record) => {
  const body = JSON.parse(record.body);
  const { detail } = body;
  const { payload, metadata, errors } = detail;
  const topic = getMetadataValue(metadata, 'X-Shopify-Topic');
  const rawBody = createRawBody(body);

  if (errors) {
    return await logger.error(
      `Error processing ${topic} webhook record`,
      null,
      { errors, record }
    );
  }

  await processData(metadata, payload, rawBody);
};

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  if (event.Records) {
    // SQS (production).
    const results = await Promise.allSettled(event.Records.map(processRecord));
    const anyFailed = results.some(({ status }) => status === 'rejected');

    if (anyFailed) {
      throw new Error('Failed to process one or more records');
    }
  } else {
    // HTTP (development).
    await processData(event.headers, JSON.parse(event.body), event.body);

    return {
      statusCode: StatusCodes.OK,
      body: ReasonPhrases.OK
    };
  }
};

module.exports.handler = handler;

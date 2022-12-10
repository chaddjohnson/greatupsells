const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const {
  checkWebhookHmacValidity,
  createRawBody
} = require('shopify-hmac-validation');
const HttpClient = require('@greatupsells/gateway-http-client');
const logger = require('@greatupsells/logger');

const { SHOPS_API_URL, SHOPIFY_ADMIN_APP_API_SECRET_KEY } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

const processData = async (metadata, data, rawData) => {
  let product = null;

  try {
    const hmac = metadata['X-Shopify-Hmac-Sha256'];
    const hmacValid = checkWebhookHmacValidity(
      SHOPIFY_ADMIN_APP_API_SECRET_KEY,
      rawData,
      hmac
    );
    const topic = metadata['X-Shopify-Topic'];

    if (!hmacValid) {
      await logger.warn(`Invalid HMAC for ${topic} webhook`, null, {
        metadata,
        data
      });
    }

    const shopifyProductData = data;
    const shopifyProductId = shopifyProductData.id;

    product = await httpClient.get(
      `/products/shopify-product-id/${shopifyProductId}`
    );

    await logger.info(
      `Deleting product ${product.title} via ${topic} webhook`,
      { metadata, data }
    );

    await httpClient.delete(`/products/${product._id}`);
  } catch (error) {
    if (!product) {
      return;
    }

    await logger.error(
      `Error processing product deletion webhook data`,
      error,
      { metadata, data }
    );
  }
};

const processRecord = async (record) => {
  const body = JSON.parse(record.body);
  const { detail } = body;
  const { payload, metadata, errors } = detail;
  const topic = metadata['X-Shopify-Topic'];

  if (errors) {
    return await logger.error(
      `Error processing ${topic} webhook record`,
      null,
      { errors, record }
    );
  }

  await processData(metadata, payload, createRawBody(payload));
};

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

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

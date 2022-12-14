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
  try {
    const hmac =
      metadata['X-Shopify-Hmac-Sha256'] || metadata['X-Shopify-Hmac-SHA256'];
    const hmacValid = checkWebhookHmacValidity(
      SHOPIFY_ADMIN_APP_API_SECRET_KEY,
      rawData,
      hmac
    );
    const domain = metadata['X-Shopify-Shop-Domain'];
    const topic = metadata['X-Shopify-Topic'];

    if (!hmacValid) {
      await logger.warn(`Invalid HMAC for ${topic} webhook`, null, {
        metadata,
        data
      });
    }

    const shopifyShopData = data;
    const shop = await httpClient.get(`/shops/domain/${domain}`);

    await logger.info(`Updating shop ${shop.domain} via ${topic} webhook`, {
      metadata,
      data
    });

    shop.shopifyShopData = shopifyShopData;

    await httpClient.put(`/shops/${shop._id}`, shop);
  } catch (error) {
    await logger.error(`Error processing shop webhook data`, error, {
      metadata,
      data
    });
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

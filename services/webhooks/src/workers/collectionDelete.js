const { StatusCodes, ReasonPhrases } = require('http-status-codes');
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
  let collection = null;

  try {
    const hmac = metadata['X-Shopify-Hmac-Sha256'];
    const hmacValid = checkWebhookHmacValidity(
      SHOPIFY_ADMIN_APP_API_SECRET_KEY,
      rawData,
      hmac
    );

    if (!hmacValid) {
      await logger.warn('Invalid HMAC for webhook', null, { metadata, data });
    }

    const shopifyCollectionData = data;
    const domain = metadata['X-Shopify-Shop-Domain'];
    const shop = await httpClient.get(`/shops/domain/${domain}`);

    collection = await httpClient.get(
      `/collections/shopify-collection-id/${shopifyCollectionData.id}`
    );

    await logger.info(
      `Deleting collection "${collection.title}" for shop ${shop.domain} via webhook`,
      { data }
    );

    await httpClient.delete(`/collections/${collection._id}`);
  } catch (error) {
    if (!collection) {
      return;
    }

    await logger.error(
      `Error processing collection deletion webhook data`,
      error,
      { metadata, data }
    );
  }
};

const processRecord = async (record) => {
  const body = JSON.parse(record.body);
  const { detail } = body;
  const { payload, metadata, errors } = detail;

  if (errors) {
    return await logger.error(
      `Error processing collection deletion webhook record`,
      null,
      { errors, record }
    );
  }

  await processData(metadata, payload, createRawBody(payload));
};

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  if (event.Records) {
    // SQS (production).
    await Promise.allSettled(event.Records.map(processRecord));
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

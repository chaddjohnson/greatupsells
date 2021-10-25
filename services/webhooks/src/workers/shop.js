const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const {
  checkWebhookHmacValidity,
  createRawBody
} = require('shopify-hmac-validation');
const { aws4Interceptor } = require('aws4-axios');
const HttpClient = require('@greatupsellshttp-client').default;
const logger = require('@greatupsellslogger');

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
  try {
    const hmac = metadata['X-Shopify-Hmac-Sha256'];
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

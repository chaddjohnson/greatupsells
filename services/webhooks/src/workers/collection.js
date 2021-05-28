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
  try {
    const hmac = metadata['X-Shopify-Hmac-Sha256'];
    const hmacValid = checkWebhookHmacValidity(
      SHOPIFY_ADMIN_APP_API_SECRET_KEY,
      rawData,
      hmac
    );

    if (!hmacValid) {
      await logger.error('Invalid HMAC for webhook', data);
    }

    const shopifyCollectionData = data;
    const shopifyCollectionId = shopifyCollectionData.id;
    const domain = metadata['X-Shopify-Shop-Domain'];
    const shop = await httpClient.get(`/shops/domain/${domain}`);
    const { shopifyShopId } = shop;
    let collection = null;
    let dataIsNewer = false;

    try {
      collection = await httpClient.get(
        `/collections/shopify-collection-id/${shopifyCollectionId}`
      );
      dataIsNewer =
        !collection.shopifyCollectionData ||
        new Date(shopifyCollectionData.updated_at) >
          new Date(collection.shopifyCollectionData.updated_at);

      if (dataIsNewer) {
        collection.shopifyCollectionData = shopifyCollectionData;

        await httpClient.put(`/collections/${collection._id}`, collection);
      }
    } catch (error) {
      await httpClient.post('/collections', {
        shop: shop._id,
        shopifyShopId,
        shopifyCollectionId,
        shopifyCollectionData
      });
    }
  } catch (error) {
    await logger.error(`Error processing collection webhook data`, error, data);
  }
};

const processRecord = async (record) => {
  const body = JSON.parse(record.body);
  const { detail } = body;
  const { payload, metadata, errors } = detail;

  if (errors) {
    return await logger.error(
      `Error processing collection webhook record`,
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

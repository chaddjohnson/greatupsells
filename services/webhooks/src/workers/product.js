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
  try {
    const hmac = getMetadataValue(metadata, 'X-Shopify-Hmac-SHA256');
    const hmacValid = checkWebhookHmacValidity(
      SHOPIFY_ADMIN_APP_API_SECRET_KEY,
      rawBody,
      hmac
    );
    const topic = getMetadataValue(metadata, 'X-Shopify-Topic');
    const domain = getMetadataValue(metadata, 'X-Shopify-Shop-Domain');

    console.log({
      hmacValid,
      hmac,
      topic,
      SHOPIFY_ADMIN_APP_API_SECRET_KEY,
      rawBody
    });

    if (!hmacValid) {
      await logger.error(`Invalid HMAC for ${topic} webhook`, null, {
        metadata,
        data
      });
    }

    const shopifyProductData = data;
    const shopifyProductId = shopifyProductData.id;
    const shop = await httpClient.get(`/shops/domain/${domain}`);
    const { shopifyShopId } = shop;
    let product = null;
    let dataIsNewer = false;

    try {
      product = await httpClient.get(
        `/products/shopify-product-id/${shopifyProductId}`
      );
      dataIsNewer =
        !product.shopifyProductData ||
        new Date(shopifyProductData.updated_at) >
          new Date(product.shopifyProductData.updated_at);

      if (dataIsNewer) {
        product.shopifyProductData = shopifyProductData;

        await httpClient.put(`/products/${product._id}`, product);
      }
    } catch (error) {
      await httpClient.post(`/products`, {
        shop: shop._id,
        shopifyShopId,
        shopifyProductId,
        shopifyProductData
      });
    }
  } catch (error) {
    await logger.error(`Error processing product webhook data`, error, {
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

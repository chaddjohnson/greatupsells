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
  try {
    const hmac = metadata['X-Shopify-Hmac-Sha256'];
    const hmacValid = checkWebhookHmacValidity(
      SHOPIFY_ADMIN_APP_API_SECRET_KEY,
      rawData,
      hmac
    );

    if (!hmacValid) {
      await logger.error('Invalid HMAC for webhook', null, { metadata, data });
    }

    const shopifyProductData = data;
    const shopifyProductId = shopifyProductData.id;
    const domain = metadata['X-Shopify-Shop-Domain'];
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

  if (errors) {
    return await logger.error(`Error processing product webhook record`, null, {
      errors,
      record
    });
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

    return {
      statusCode: StatusCodes.OK,
      body: ReasonPhrases.OK
    };
  }
};

module.exports.handler = handler;

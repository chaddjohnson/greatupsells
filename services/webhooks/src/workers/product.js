const {
  checkWebhookHmacValidity,
  createRawBody
} = require('shopify-hmac-validation');
const { aws4Interceptor } = require('aws4-axios');
const HttpClient = require('@neatowebsolutions/upselling-http-client');
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

const processRecord = async (record) => {
  try {
    const body = JSON.parse(record.body);
    const { detail } = body;
    const { payload, metadata, errors } = detail;

    if (errors) {
      return await logger.error(
        `Error handling product webhook`,
        errors,
        record
      );
    }

    const hmac = metadata['X-Shopify-Hmac-SHA256'];
    const hmacValid = checkWebhookHmacValidity(
      SHOPIFY_ADMIN_APP_API_SECRET_KEY,
      createRawBody(payload),
      hmac
    );

    if (!hmacValid) {
      return await logger.error('Invalid HMAC for webhook', record);
    }

    const shopifyProductData = payload;
    const shopifyProductId = shopifyProductData.id;
    const domain = metadata['X-Shopify-Shop-Domain'];
    const shop = await httpClient.get(`/shops/domain/${domain}`);
    const { shopifyShopId } = shop;
    const product = await httpClient.get(
      `/products/shopify-product-id/${shopifyProductId}`
    );
    const dataIsNewer =
      !product ||
      !product.shopifyProductData ||
      new Date(shopifyProductData.updated_at) >
        new Date(product.shopifyProductData.updated_at);

    if (!product) {
      await logger.debug(`Creating product via webhook`, record);

      await httpClient.post(`/products`, {
        shop: shop._id,
        shopifyShopId,
        shopifyProductId,
        shopifyProductData
      });
    } else if (dataIsNewer) {
      await logger.debug(`Updating product via webhook`, record);

      product.shopifyProductData = shopifyProductData;

      await httpClient.put(`/products/${product._id}`, product);
    }
  } catch (error) {
    await logger.error(`Error handling product webhook`, error, record);
  }
};

const handler = async (event) => {
  await Promise.all(event.Records.map(processRecord));
};

module.exports = handler;

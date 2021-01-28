const {
  checkWebhookHmacValidity,
  createRawBody
} = require('shopify-hmac-validation');
const HttpClient = require('@neatowebsolutions/upselling-http-client');
const logger = require('@neatowebsolutions/upselling-logger');

const { SHOPS_API_URL, SHOPIFY_ADMIN_API_SECRET_KEY } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

const processRecord = async (record) => {
  try {
    const body = JSON.parse(record.body);
    const { detail } = body;
    const { payload, metadata, errors } = detail;

    if (errors) {
      return await logger.error(
        `Error handling product deletion webhook`,
        errors,
        record
      );
    }

    const hmac = metadata['X-Shopify-Hmac-SHA256'];
    const hmacValid = checkWebhookHmacValidity(
      SHOPIFY_ADMIN_API_SECRET_KEY,
      createRawBody(payload),
      hmac
    );

    if (!hmacValid) {
      return await logger.error('Invalid HMAC for webhook', record);
    }

    const shopifyProductData = payload;
    const shopifyProductId = shopifyProductData.id;
    const product = await httpClient.get(
      `/products/shopify-product-id/${shopifyProductId}`
    );

    await logger.debug(`Deleting product via webhook`, record);

    await httpClient.delete(`/products/${product._id}`);
  } catch (error) {
    await logger.error(
      `Error handling product deletion webhook`,
      error,
      record
    );
  }
};

const handler = async (event) => {
  await Promise.all(event.Records.map(processRecord));
};

module.exports = handler;

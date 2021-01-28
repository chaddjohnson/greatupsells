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
        `Error handling app uninstall webhook`,
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

    const domain = metadata['X-Shopify-Shop-Domain'];
    const shop = await httpClient.get(`/shops/domain/${domain}`);

    await logger.info(`Deactivating shop ${shop.domain} via webhook`, record);

    await httpClient.post(`/shops/${shop._id}/deactivation`);
  } catch (error) {
    await logger.error(`Error handling app uninstall webhook`, error, record);
  }
};

const handler = async (event) => {
  await Promise.all(event.Records.map(processRecord));
};

module.exports = handler;

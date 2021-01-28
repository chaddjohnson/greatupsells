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
        `Error handling order paid webhook`,
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

    const shopifyOrderData = payload;
    const shopifyOrderId = shopifyOrderData.id;
    const domain = metadata['X-Shopify-Shop-Domain'];
    const shop = await httpClient.get(`/shops/domain/${domain}`);
    const { shopifyShopId } = shop;
    const order = await httpClient.get(
      `/orders/shopify-order-id/${shopifyOrderId}`
    );

    // Track the order if it is not already tracked. We ONLY track paid orders;
    // unpaid orders are not counted as conversions.
    if (!order) {
      await logger.debug(`Creating order via webhook`, record);

      await httpClient.post(`/orders`, {
        shop: shop._id,
        shopifyShopId,
        shopifyOrderId,
        shopifyOrderNumber: shopifyOrderData.order_number,
        shopifyOrderData
      });
    }
  } catch (error) {
    await logger.error(`Error handling order paid webhook`, error, record);
  }
};

const handler = async (event) => {
  await Promise.all(event.Records.map(processRecord));
};

module.exports = handler;

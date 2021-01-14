const HttpClient = require('@neatowebsolutions/upselling-http-client');
const logger = require('@neatowebsolutions/upselling-logger');

const { SHOPS_API_URL } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

const processRecord = async (record) => {
  try {
    const { detail } = JSON.parse(record.body);
    const { metadata, payload, errors } = detail;

    if (errors) {
      return await logger.error(
        `Error handling order paid webhook`,
        errors,
        record
      );
    }

    const shopifyOrderData = payload.order;
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

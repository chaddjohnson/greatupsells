const HttpClient = require('@neatowebsolutions/upselling-http-client');
const logger = require('@neatowebsolutions/upselling-logger');

const { SHOPS_API_URL } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

const processRecord = async (record) => {
  try {
    const { detail } = JSON.parse(record.body);
    const { payload, errors } = detail;

    if (errors) {
      return logger.error(
        `Error handling order update webhook`,
        errors,
        record
      );
    }

    const shopifyOrderData = payload.order;
    const shopifyOrderId = shopifyOrderData.id;
    const order = await httpClient.get(
      `/orders/shopify-order-id/${shopifyOrderId}`
    );
    const dataIsNewer =
      !order ||
      !order.shopifyOrderData ||
      new Date(shopifyOrderData.updated_at) >
        new Date(order.shopifyOrderData.updated_at);

    if (order && dataIsNewer) {
      logger.debug(`Updating order ${order.orderNumber} via webhook`, record);

      order.shopifyOrderData = shopifyOrderData;

      await httpClient.put(`/orders/${order._id}`, order);
    }
  } catch (error) {
    logger.error(`Error handling order update webhook`, error, record);
  }
};

const handler = async (event) => {
  await Promise.all(event.Records.map(processRecord));
};

module.exports = handler;

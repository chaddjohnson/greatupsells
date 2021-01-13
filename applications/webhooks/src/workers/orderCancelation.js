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
        `Error handling order cancelation via webhook`,
        errors,
        record
      );
    }

    const shopifyOrderData = payload.order;
    const order = await httpClient.get(
      `/orders/shopify-order-id/${shopifyOrderData.id}`
    );

    if (!order) {
      return;
    }

    logger.debug(`Updating order ${order.orderNumber} via webhook`, record);

    order.shopifyOrderData = shopifyOrderData;

    await httpClient.put(`/orders/${order._id}`, order);

    // Only cancel if the order is not marked as canceled.
    if (order && !order.canceledAt) {
      logger.info(`Canceling order ${order.orderNumber} via webhook`, record);

      await httpClient.post(`/orders/${order._id}/cancelation`);
    }
  } catch (error) {
    logger.error(`Error handling order update via webhook`, error, record);
  }
};

const handler = async (event) => {
  await Promise.all(event.Records.map(processRecord));
};

module.exports = handler;

const { StatusCodes } = require('http-status-codes');
const models = require('@neatowebsolutions/upselling-models');
const logger = require('@neatowebsolutions/logger');

const handler = async (request, response) => {
  const data = response.body;
  const Order = await models.get('Order');
  const shopifyOrderId = data.id;
  const order = await Order.findByShopifyOrderId(shopifyOrderId);
  const { shop } = order || {};

  if (!order) {
    return response.status(StatusCodes.OK).end();
  }

  try {
    if (order && !order.canceledAt) {
      await order.execPopulate('shop');

      // Update local Shopify data for the order.
      order.shopifyOrderData = data;

      await order.save();

      // Handle order cancelation.
      await order.cancel();

      logger.debug(`Order canceled (${order.toString()}) via webhook`, data);
    }
  } catch (error) {
    logger.error(
      `Error updating order for shop (${shop.toString()})`,
      error,
      data
    );
  }

  response.status(StatusCodes.OK).end();
};

module.exports = handler;

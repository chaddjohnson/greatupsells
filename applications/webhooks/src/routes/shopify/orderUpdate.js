const { StatusCodes } = require('http-status-codes');
const models = require('@neatowebsolutions/upselling-models');
const logger = require('@neatowebsolutions/upselling-logger');

const handler = async (request, response) => {
  const domain = request.headers['x-shopify-shop-domain'];
  const data = request.body;
  const Shop = await models.get('Shop');
  const Order = await models.get('Order');
  const shop = await Shop.findByDomain(domain);
  const shopifyOrderId = data.id;
  const order = await Order.findByShopifyOrderId(shopifyOrderId);
  const dataIsNewer =
    !order ||
    !order.shopifyOrderData ||
    new Date(data.updated_at) > new Date(order.shopifyOrderData.updated_at);

  try {
    if (order && dataIsNewer) {
      await order.execPopulate('shop');

      // Update local Shopify data for the order.
      order.shopifyOrderData = data;

      await order.save();

      logger.debug(`Order updated (${order.toString()}) via webhook`, data);
    }
  } catch (error) {
    logger.error(
      `Error updating order ${shopifyOrderId} for shop (${shop.toString()})`,
      error,
      data
    );
  }

  response.status(StatusCodes.OK).end();
};

module.exports = handler;

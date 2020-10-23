const { StatusCodes } = require('http-status-codes');
const models = require('@neatowebsolutions/upselling-models');
const logger = require('@neatowebsolutions/logger');

const handler = async (request, response) => {
  const domain = request.headers['x-shopify-shop-domain'];
  const data = request.body;
  const Shop = await models.get('Shop');
  const Order = await models.get('Order');
  const shop = await Shop.findByDomain(domain);
  const shopifyOrderId = data.id;
  const order = await Order.findByShopifyOrderId(shopifyOrderId);
  const dataIsNewer =
    !!order &&
    new Date(data.updated_at) > new Date(order.shopifyOrderData.updated_at);

  // Respond immediately so that Shopify does not consider this webhook as timed out.
  response.status(StatusCodes.OK).end();

  try {
    if (order && dataIsNewer) {
      // Update local Shopify data for the order.
      order.shopifyOrderData = data;

      await order.save();
    }
  } catch (error) {
    logger.error(
      `Error updating order ${shopifyOrderId} for shop (${shop.toString()})`,
      error,
      data
    );
  }
};

module.exports = handler;

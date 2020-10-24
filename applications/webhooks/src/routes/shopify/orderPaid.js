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
  let order = await Order.findByShopifyOrderId(shopifyOrderId);
  let offerHits = [];

  try {
    // Track the order if it is not already tracked.
    // We ONLY track paid orders; unpaid orders are not counted as conversions.
    if (!order) {
      order = await Order.create({
        shop,
        shopifyShopId: shop.shopifyShopId,
        shopifyOrderId,
        shopifyOrderNumber: data.order_number,
        shopifyOrderData: data
      });
      offerHits = await order.trackConversions();

      logger.debug(`Order created (${order.toString()}) via webhook`, data);

      // Only track orders resulting in offer conversions.
      if (offerHits.length === 0) {
        await order.remove();
      }
    }
  } catch (error) {
    logger.error(
      `Error processing order ${shopifyOrderId} for shop (${shop.toString()})`,
      error,
      data
    );
  }

  response.status(StatusCodes.OK).end();
};

module.exports = handler;

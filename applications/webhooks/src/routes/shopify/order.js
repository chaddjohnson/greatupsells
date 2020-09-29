const httpStatus = require('http-status-codes');
const models = require('@neatowebsolutions/upselling-models');
const logger = require('@neatowebsolutions/logger');

const handler = async (request, response) => {
  const domain = request.headers['x-shopify-shop-domain'];
  const data = request.body;
  const Shop = await models.get('Shop');
  const Order = await models.get('Order');
  const shop = await Shop.findByDomain(domain);
  let order = await Order.findByShopifyOrderId(data.id);

  // Respond immediately so that Shopify does not consider this webhook as timed out.
  response.status(httpStatus.OK).end();

  if (!shop) {
    return logger.warn(
      `Shop ${domain} not found for shop update webhook`,
      data
    );
  }

  try {
    // Track the order if it is not already tracked.
    if (!order) {
      order = await Order.create({
        shop,
        shopifyShopId: shop.shopifyShopId,
        shopifyOrderId: data.id,
        shopifyOrderNumber: data.order_number,
        shopifyOrderData: data
      });

      await order.trackConversions();
    }

    await order.save();
  } catch (error) {
    logger.error(`Error processing order ${data.id}`, error, data);
  }
};

module.exports = handler;

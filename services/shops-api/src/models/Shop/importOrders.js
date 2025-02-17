const Promise = require('bluebird');
const logger = require('@greatupsells/logger');
const models = require('..');

const importOrder = async (shop, shopifyOrderData) => {
  try {
    const Order = await models.get('Order');
    const { shopifyShopId } = shop;
    const shopifyOrderId = shopifyOrderData.id;
    const shopifyOrderNumber = shopifyOrderData.order_number;
    let order = await Order.findOneByShopifyOrderId(shopifyOrderData.id);

    if (order) {
      order.shopifyOrderData = shopifyOrderData;
      return await order.save();
    } else {
      order = await Order.create({
        shop,
        shopifyShopId,
        shopifyOrderId,
        shopifyOrderNumber,
        shopifyOrderData
      });
      await logger.info(`Imported order from Shopify (${order.toString()})`, {
        shopifyOrderData
      });

      return order;
    }
  } catch (error) {
    await logger.warn(`Error importing Shopify order ${shopifyOrderData.id} for shop (${shop.toString()})`, error);
  }
};

const importOrders = async (shop) => {
  const Order = await models.get('Order');
  const shopifyApiClient = shop.getShopifyApiClient();
  let params = { limit: 100 };
  let orderIds = [];

  // Handle pagination.
  do {
    const shopifyOrders = await shopifyApiClient.order.list(params);
    const orders = await Promise.map(shopifyOrders, async (shopifyOrderData) => importOrder(shop, shopifyOrderData), {
      concurrency: 10
    });

    orderIds = orderIds.concat(orders.map((order) => order.id));
    params = shopifyOrders.nextPageParameters;
  } while (params);

  // Track paired purchases for all orders.
  await Promise.mapSeries(orderIds, async (orderId) => {
    const order = await Order.findById(orderId);
    await order.trackPairedPurchases();
  });
};

module.exports = importOrders;

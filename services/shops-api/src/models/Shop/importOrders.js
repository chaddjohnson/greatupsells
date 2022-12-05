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
      await order.save();
    } else {
      order = await Order.create({
        shop,
        shopifyShopId,
        shopifyOrderId,
        shopifyOrderNumber,
        shopifyOrderData
      });
      await order.trackPairedPurchases();
      await logger.info(`Imported order from Shopify (${order.toString()})`, {
        shopifyOrderData
      });
    }
  } catch (error) {
    await logger.warn(
      `Error importing Shopify order ${
        shopifyOrderData.id
      } for shop (${shop.toString()})`,
      error
    );
  }
};

const importOrders = async (shop) => {
  const shopifyApiClient = shop.getShopifyApiClient();
  let params = { limit: 100 };

  // Handle pagination.
  do {
    const shopifyOrders = await shopifyApiClient.order.list(params);

    await Promise.mapSeries(shopifyOrders, async (shopifyOrderData) => {
      await importOrder(shop, shopifyOrderData);
    });

    params = shopifyOrders.nextPageParameters;
  } while (params);
};

module.exports = importOrders;

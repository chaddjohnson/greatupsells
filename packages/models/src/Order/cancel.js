const Promise = require('bluebird');

const cancel = async (order) => {
  // Abort if the order is already canceled.
  if (order.canceledAt) {
    return;
  }

  await order.execPopulate('shop');

  const models = require('..');
  const OfferHit = await models.get('OfferHit');
  const Shop = await models.get('Shop');
  const { shop, shopifyOrderId } = order;
  const offerHits = await OfferHit.findByShopifyOrderId(shopifyOrderId);

  // Update stats for the order. Use one round trip to prevent write conflicts.
  await order.findByIdAndUpdate(order.id, {
    // Zero out revenue increase for the order.
    revenueIncrease: 0,

    // Mark the order as canceled.
    canceledAt: Date.now()
  });

  // Update stats for the shop. Use one round trip to prevent write conflicts. Use $inc in case the write is retried.
  await Shop.findByIdAndUpdate(shop.id, {
    $inc: {
      revenueIncrease: order.revenueIncrease * -1,
      conversionCount: -1
    }
    // conversionRate: // TODO
  });

  // Update offer hits.
  await Promise.map(offerHits, async (offerHit) => {
    // Update the offer hit. Use one round trip to prevent write conflicts.
    await OfferHit.findByIdAndUpdate(offerHit.id, {
      // Retract the conversion.
      convertedAt: undefined,

      // Zero out revenue increase for the order.
      revenueIncrease: 0
    });
  });
};

module.exports = cancel;

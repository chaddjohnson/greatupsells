const Promise = require('bluebird');
const mongodbClient = require('../mongodbClient');
const models = require('..');

const promiseWhile = (conditionFn, fn) => {
  const whilst = () => {
    return conditionFn() ? fn().then(whilst) : Promise.resolve();
  };
  return whilst();
};

const trackConversions = async (order) => {
  const [OfferHit, Shop] = await Promise.all([
    models.get('OfferHit'),
    models.get('Shop')
  ]);

  await order.execPopulate('shop');

  // Find all offer hits associated with the order.
  const { shop, shopifyOrderId } = order;
  let offerHits = [];
  let attempts = 0;
  const conditionFn = () => offerHits.length === 0 && attempts < 7;

  // Try multiple times to find offer hits for the shopify order. This is due
  // to a race condition where that an order may be created at the same time as
  // a draft order being updated. In draft order updates, offer hits are
  // associated with completed orders.
  await promiseWhile(conditionFn, async () => {
    offerHits = await OfferHit.find({ shopifyOrderId });
    attempts++;
    await Promise.delay(1 * 1000);
  });

  if (offerHits.length === 0) {
    return [];
  }

  const session = await mongodbClient.connection.startSession();
  const transactionOptions = { readPreference: 'primary' };

  // Use a transaction.
  await session.withTransaction(async () => {
    order.$session(session);

    // Track conversions for offer hits. Do so sequentially to avoid data conflicts.
    await Promise.map(
      offerHits,
      async (offerHit) => {
        await offerHit.trackConversion(order);
      },
      { concurrency: 1 }
    );

    // Track the total revenue increase for the order.
    order.revenueIncrease = offerHits.reduce((sum, offerHit) => {
      return sum + (offerHit.revenueIncrease || 0);
    }, 0);

    await order.save();
  }, transactionOptions);

  // Calculate month upsell revenue for the shop.
  const monthUpsellRevenue = await shop.calculateMonthUpsellRevenue();

  await Shop.findByIdAndUpdate(shop.id, {
    'plan.monthUpsellRevenue': monthUpsellRevenue
  });

  return offerHits;
};

module.exports = trackConversions;

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
  const [OfferHit] = await Promise.all([
    models.get('OfferHit'),
    models.get('Shop')
  ]);

  await order.execPopulate('shop');

  // Find all offer hits associated with the order.
  const { shopifyOrderId } = order;
  let offerHits = [];
  let attempts = 0;
  const conditionFn = () => offerHits.length === 0 && attempts < 3;

  await promiseWhile(conditionFn, async () => {
    offerHits = await OfferHit.find({ shopifyOrderId });
    attempts++;
    await Promise.delay(500);
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

  return offerHits;
};

module.exports = trackConversions;

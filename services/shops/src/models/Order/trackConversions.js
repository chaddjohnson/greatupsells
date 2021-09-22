const Promise = require('bluebird');
const mongodbClient = require('../mongodbClient');
const models = require('..');

const trackConversions = async (order) => {
  const [OfferHit] = await Promise.all([
    models.get('OfferHit'),
    models.get('Shop')
  ]);

  await order.execPopulate('shop');

  // Get line items for the order.
  const lineItems = order.shopifyOrderData.line_items || [];

  // Find all offer hits associated with line items.
  let offerHits = await Promise.all(
    lineItems.map(
      async ({ variant_id: variantId }) =>
        variantId && OfferHit.findOneByAcceptedVariantId(variantId)
    )
  );

  offerHits = offerHits.filter(Boolean);

  if (offerHits.length === 0) {
    return offerHits;
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

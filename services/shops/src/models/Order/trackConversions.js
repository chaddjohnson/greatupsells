const Promise = require('bluebird');
const { compact } = require('lodash');
const mongodbClient = require('../mongodbClient');

const trackConversions = async (order) => {
  await order.execPopulate('shop');

  const OfferHit = mongodbClient.connection.model('OfferHit');

  // Get line items for the order.
  const lineItems = order.shopifyOrderData.line_items || [];

  // Find all offer hits associated with line items.
  const offerHits = compact(
    await Promise.all(
      lineItems.map(
        async ({ variant_id: variantId }) =>
          variantId && OfferHit.findByAcceptedVariantId(variantId)
      )
    )
  );

  if (offerHits.length === 0) {
    return offerHits;
  }

  const session = await mongodbClient.connection.startSession();

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
  });

  return offerHits;
};

module.exports = trackConversions;

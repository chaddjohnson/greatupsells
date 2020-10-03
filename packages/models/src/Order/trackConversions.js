const Promise = require('bluebird');
const { compact } = require('lodash');

const trackConversions = async (order) => {
  const models = require('..');
  const OfferHit = await models.get('OfferHit');

  // Get line items for the order.
  const lineItems = order.shopifyOrderData.line_items || [];

  // Find all offer hits associated with line items.
  const offerHits = compact(
    await Promise.all(
      lineItems.map(async (lineItem) =>
        OfferHit.findByAcceptedShopifyProductId(lineItem.id)
      )
    )
  );

  // Track conversions for offer hits
  await Promise.all(
    offerHits.map(async (offerHit) => {
      await offerHit.trackConversion(order);
    })
  );

  // Track revenue increase for order
  order.revenueIncrease = offerHits.reduce((sum, offerHit) => {
    return sum + (offerHit.revenueIncrease || 0);
  }, 0);

  await order.save();
};

module.exports = trackConversions;

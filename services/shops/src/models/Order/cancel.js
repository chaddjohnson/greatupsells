const Promise = require('bluebird');
const mongodbClient = require('../mongodbClient');
const models = require('..');

const cancel = async (order) => {
  // Abort if the order is already canceled.
  if (order.canceledAt) {
    return;
  }

  await models.get('Shop');
  await models.get('Offer');
  await order.execPopulate('shop');

  const Order = await models.get('Order');
  const OfferHit = await models.get('OfferHit');
  const Offer = await models.get('Offer');
  const Shop = await models.get('Shop');
  const { shop } = order;
  const offerHits = await OfferHit.findByOrderId(order._id);

  const session = await mongodbClient.connection.startSession();
  const transactionOptions = { readPreference: 'primary' };

  // Use a transaction.
  await session.withTransaction(async () => {
    // Update stats for the shop. Use $inc and in round trip to prevent conflicts and in case the write is retried.
    await Shop.findByIdAndUpdate(
      shop.id,
      {
        $inc: {
          revenueIncrease: order.revenueIncrease * -1,
          offerConversionCount: offerHits.length * -1
        },
        offerConversionRate:
          (shop.offerConversionCount - 1) / shop.offerImpressionCount
      },
      { session }
    );

    // Update stats for the order. Use one round trip to prevent write conflicts.
    await Order.findByIdAndUpdate(
      order.id,
      {
        // Zero out revenue increase for the order.
        revenueIncrease: 0,

        // Mark the order as canceled.
        canceledAt: Date.now()
      },
      { session }
    );

    // Update offer hits.
    await Promise.map(offerHits, async (offerHit) => {
      await offerHit.execPopulate('offer');

      const { offer } = offerHit;

      // Update the offer hit. Use one round trip to prevent write conflicts.
      await OfferHit.findByIdAndUpdate(
        offerHit.id,
        {
          // Retract the conversion.
          convertedAt: undefined,

          // Zero out revenue increase for the order.
          revenueIncrease: 0
        },
        { session }
      );

      // Update the offer associated with the offer hit.
      await Offer.findByIdAndUpdate(
        offerHit.offer.id,
        {
          $inc: {
            revenueIncrease: offerHit.revenueIncrease * -1,
            conversionCount: -1
          },
          conversionRate: (offer.conversionCount - 1) / offer.impressionCount
        },
        { session }
      );
    });
  }, transactionOptions);

  session.endSession();
};

module.exports = cancel;

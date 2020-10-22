const Promise = require('bluebird');
const mongodbClient = require('../mongodbClient');

const cancel = async (order) => {
  // Abort if the order is already canceled.
  if (order.canceledAt) {
    return;
  }

  await order.execPopulate('shop');

  const OfferHit = mongodbClient.connection.model('OfferHit');
  const Offer = mongodbClient.connection.model('Offer');
  const Shop = mongodbClient.connection.model('Shop');
  const { shop, shopifyOrderId } = order;
  const offerHits = await OfferHit.findByShopifyOrderId(shopifyOrderId);

  const session = await mongodbClient.connection.startSession();

  // Use a transaction.
  await session.withTransaction(async () => {
    // Update stats for the shop. Use $inc and in round trip to prevent conflicts and in case the write is retried.
    await Shop.findByIdAndUpdate(
      shop.id,
      {
        $inc: {
          revenueIncrease: order.revenueIncrease * -1,
          conversionCount: -1
        },
        conversionRate: (shop.conversionCount - 1) / shop.viewCount
      },
      { session }
    );

    // Update stats for the order. Use one round trip to prevent write conflicts.
    await order.findByIdAndUpdate(
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
          conversionRate: (offer.conversionCount - 1) / offer.viewCount
        },
        { session }
      );
    });
  });

  session.endSession();
};

module.exports = cancel;

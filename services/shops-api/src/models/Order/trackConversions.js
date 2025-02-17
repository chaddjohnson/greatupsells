const Promise = require('bluebird');
const { DateTime } = require('luxon');
const emailClient = require('@greatupsells/email-client');
const mongodbClient = require('../mongodbClient');
const models = require('..');

const { DOMAIN, APP_NAME, SHOPIFY_ADMIN_APP_API_KEY } = process.env;

const sendUsageNotifications = async (
  shop,
  monthUpsellRevenue,
  originalMonthUpsellRevenue
) => {
  const { monthUpsellRevenueLimit, billingOn } = shop.plan;
  const monthUpsellReveueLimitNear =
    monthUpsellRevenueLimit &&
    originalMonthUpsellRevenue < monthUpsellRevenueLimit * 0.8 &&
    monthUpsellRevenue >= monthUpsellRevenueLimit * 0.8;
  const monthUpsellRevenueLimitReached =
    monthUpsellRevenueLimit &&
    originalMonthUpsellRevenue < monthUpsellRevenueLimit &&
    monthUpsellRevenue >= monthUpsellRevenueLimit;
  const planRenewalDateFormatted =
    DateTime.fromJSDate(billingOn).toFormat('MMM d, y');

  // Send email when 80% of earnings limit has been reached
  if (monthUpsellReveueLimitNear) {
    await emailClient.enqueue({
      to: shop.contactEmail,
      from: `support@${DOMAIN}`,
      subject: '80% of month upsell revenue allowance used',
      body: `
        <p>Hi ${shop.contactName},</p>
        <p>Your shop has used 80% of its upsell revenue allowance for the month. Your allowance of $${monthUpsellRevenueLimit} USD will renew on ${planRenewalDateFormatted}.</p>
        <p>To ensure upselling continues without disruption, please upgrade your plan <a href="https://admin.shopify.com/store/${shop.name}/apps/${SHOPIFY_ADMIN_APP_API_KEY}/plan">here</a>.</p>
        <br />
        <p>Thank you,</p>
        <p>${APP_NAME}</p>
      `
    });
  }

  // Send email when earnings limit has been reached.
  if (monthUpsellRevenueLimitReached) {
    await emailClient.enqueue({
      to: shop.contactEmail,
      from: `support@${DOMAIN}`,
      subject: '100% of month upsell revenue allowance used',
      body: `
        <p>Hi ${shop.contactName},</p>
        <p>Your shop has used 100% of its upsell revenue allowance for the month. Your allowance of $${monthUpsellRevenueLimit} USD will renew on ${planRenewalDateFormatted}.</p>
        <p>To continue upselling, please upgrade your plan <a href="https://admin.shopify.com/store/${shop.name}/apps/${SHOPIFY_ADMIN_APP_API_KEY}/plan">here</a>.</p>
        <br />
        <p>Thank you,</p>
        <p>${APP_NAME}</p>
      `
    });
  }
};

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
  const conditionFn = () => offerHits.length === 0 && attempts < 12;

  // Try multiple times to find offer hits for the shopify order. This is due
  // to a race condition where that an order may be created at the same time as
  // a draft order being updated. During draft order updates, offer hits are
  // associated with completed orders.
  await promiseWhile(conditionFn, async () => {
    offerHits = await OfferHit.find({ shopifyOrderId });
    attempts++;
    await Promise.delay(1 * 1000);
  });

  if (offerHits.length === 0) {
    return [];
  }

  // Filter out offer hits marked as converted.
  const unConvertedOfferHits = offerHits.filter(
    (offerHit) => !offerHit.convertedAt
  );

  const session = await mongodbClient.connection.startSession();
  const transactionOptions = { readPreference: 'primary' };

  // Use a transaction.
  await session.withTransaction(async () => {
    order.$session(session);

    // Track conversions for offer hits. Do so sequentially to avoid data conflicts.
    await Promise.mapSeries(unConvertedOfferHits, async (offerHit) => {
      await offerHit.trackConversion(order);
    });

    // Track the total revenue increase for the order.
    order.revenueIncrease = offerHits.reduce((sum, offerHit) => {
      return sum + (offerHit.revenueIncrease || 0);
    }, 0);

    await order.save();
  }, transactionOptions);

  const originalMonthUpsellRevenue = shop.plan.monthUpsellRevenue;
  const monthUpsellRevenue = await shop.calculateMonthUpsellRevenue();

  // Update month upsell revenue for the shop.
  await Shop.findByIdAndUpdate(shop.id, {
    'plan.monthUpsellRevenue': monthUpsellRevenue
  });

  // Send any usage notications to the shop.
  await sendUsageNotifications(
    shop,
    monthUpsellRevenue,
    originalMonthUpsellRevenue
  );

  return offerHits;
};

module.exports = trackConversions;

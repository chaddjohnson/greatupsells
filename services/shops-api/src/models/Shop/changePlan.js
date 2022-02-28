const getenv = require('getenv');
const logger = require('@greatupsells/logger');

const { SHOPIFY_ADMIN_APP_API_KEY } = process.env;

const plans = {
  BASIC: {
    name: 'Basic',
    price: 24.0,
    monthUpsellRevenueLimit: 500
  },
  PLUS: {
    name: 'Plus',
    price: 49.0,
    monthUpsellRevenueLimit: 1500
  },
  PRO: {
    name: 'Pro',
    price: 99.0,
    monthUpsellRevenueLimit: undefined
  }
};

const changePlan = async (shop, level) => {
  try {
    const plan = plans[level];

    if (!plan) {
      throw new Error(`Unknown plan "${level}" specified`);
    }

    // Create a new recurring application charge which will replace the existing one.
    // See https://shopify.dev/api/admin-rest/2022-01/resources/recurringapplicationcharge.
    const shopifyApiClient = shop.getShopifyApiClient();
    const recurringCharge = await shopifyApiClient.recurringApplicationCharge.create(
      {
        name: plan.name,
        price: plan.price,
        trial_days: shop.plan.chargeId ? undefined : 7,
        return_url: `https://${shop.domain}/admin/apps/${SHOPIFY_ADMIN_APP_API_KEY}/plan/`,
        test: getenv.bool('SANDBOX', true) || null
      }
    );

    // Update the shop plan details.
    shop.plan.name = plan.name;
    shop.plan.level = level;
    shop.plan.price = plan.price;
    shop.plan.chargeId = recurringCharge.id;
    shop.plan.billingOn = undefined;
    shop.plan.startedAt = undefined;
    shop.plan.canceledAt = undefined;
    shop.plan.monthUpsellRevenue = 0;
    shop.plan.monthUpsellRevenueLimit = plan.monthUpsellRevenueLimit;
    shop.plan.active = false; // Not active until shop owner approves.
    await shop.save();

    await logger.info(
      `Successfully changed plan for shop to "${level}" and created new recurring charge ${
        recurringCharge.id
      } (${shop.toString()})`,
      { recurringCharge }
    );

    return recurringCharge.confirmation_url;
  } catch (error) {
    await logger.error(
      `Error changing plan for shop to "${level}" (${shop.toString()})`,
      error
    );
    throw error;
  }
};

module.exports = changePlan;

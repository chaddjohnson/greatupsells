const getenv = require('getenv');
const logger = require('@greatupsells/logger');

const { SHOPIFY_ADMIN_APP_API_KEY } = process.env;
const isSandbox = getenv.bool('SANDBOX', true);

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

const getTrialDays = async (shop) => {
  const { chargeId, trialStartedAt } = shop.plan;
  let trialStartedDaysAgo;
  const maxTrialDays = 7;

  // Allow a trial period to complete if started; otherwise, disallow a trial period.
  if (trialStartedAt) {
    trialStartedDaysAgo = Math.round(
      (new Date() - trialStartedAt) / 1000 / 24 / 60 / 60
    );

    if (trialStartedDaysAgo < maxTrialDays) {
      return maxTrialDays - trialStartedDaysAgo;
    }

    return 0;
  }

  if (!chargeId) {
    return maxTrialDays;
  }

  const shopifyApiClient = shop.getShopifyApiClient();
  const existingRecurringCharge = await shopifyApiClient.recurringApplicationCharge.get(
    chargeId
  );
  const trialEndsOn = existingRecurringCharge.trial_ends_on;
  const remainingDays = Math.round(
    (new Date(trialEndsOn) - new Date()) / 1000 / 24 / 60 / 60
  );

  if (!remainingDays || remainingDays < 0 || remainingDays > maxTrialDays) {
    return 0;
  }

  return remainingDays;
};

const createSandboxPlan = async (shop) => {
  // Set a fake plan under sandbox mode as fucking Shopify disallows recurring application
  // charge access for custom apps.
  shop.plan = {
    name: 'Pro',
    level: 'PRO',
    price: 99,
    active: true,
    chargeId: 1234567890,
    billingOn: new Date(),
    startedAt: new Date(),
    trialStarteDate: new Date(),
    monthUpsellRevenue: 0
  };

  await shop.save();

  const redirectUrl = `/?shop=${shop.domain}`;

  return redirectUrl;
};

const createPlan = async (shop, level) => {
  const plan = plans[level];

  if (!plan) {
    throw new Error(`Unknown plan "${level}" specified`);
  }

  // Create a new recurring application charge which will replace the existing one.
  // See https://shopify.dev/api/admin-rest/2022-01/resources/recurringapplicationcharge.
  const shopifyApiClient = shop.getShopifyApiClient();
  const trialDays = await getTrialDays(shop);
  const recurringCharge = await shopifyApiClient.recurringApplicationCharge.create(
    {
      name: plan.name,
      price: plan.price,
      trial_days: trialDays,
      return_url: `https://${shop.domain}/admin/apps/${SHOPIFY_ADMIN_APP_API_KEY}/`,
      test: false
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
  shop.plan.monthUpsellRevenue = shop.plan.monthUpsellRevenue || 0;
  shop.plan.monthUpsellRevenueLimit = plan.monthUpsellRevenueLimit;
  shop.plan.active = false; // Not active until shop owner approves.

  await shop.save();

  await logger.info(
    `Successfully changed plan for shop to "${level}" and created new recurring charge ${
      recurringCharge.id
    } (${shop.toString()})`,
    { recurringCharge }
  );

  const redirectUrl = recurringCharge.confirmation_url;

  return redirectUrl;
};

const changePlan = async (shop, level) => {
  try {
    const redirectUrl = isSandbox
      ? createSandboxPlan(shop)
      : createPlan(shop, level);

    return redirectUrl;
  } catch (error) {
    await logger.error(
      `Error changing plan for shop to "${level}" (${shop.toString()})`,
      error
    );
    throw error;
  }
};

module.exports = changePlan;

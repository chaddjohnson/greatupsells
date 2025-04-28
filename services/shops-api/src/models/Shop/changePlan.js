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
  const { chargeId, trialStartedAt, trialDays } = shop.plan;
  let trialStartedDaysAgo;

  // Allow a trial period to complete if started; otherwise, disallow a trial period.
  if (trialStartedAt) {
    trialStartedDaysAgo = Math.round((new Date() - trialStartedAt) / 1000 / 24 / 60 / 60);

    if (trialStartedDaysAgo < trialDays) {
      return trialDays - trialStartedDaysAgo;
    }

    return 0;
  }

  if (!chargeId) {
    return trialDays;
  }

  // Default
  return 7;
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
  const { shopName } = shop;
  const plan = plans[level];

  if (!plan) {
    throw new Error(`Unknown plan "${level}" specified`);
  }

  // Create a new recurring application charge which will replace the existing one.
  // See https://shopify.dev/api/admin-rest/2022-01/resources/recurringapplicationcharge.
  const shopifyApiClient = shop.getGraphqlShopifyApiClient();
  const query = `
    mutation appSubscriptionCreate($name: String!, $returnUrl: URL!, $lineItems: [AppSubscriptionLineItemInput!]!) {
      appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems, test: false) {
        confirmationUrl
      }
    }
  `;
  const trialDays = await getTrialDays(shop);
  const variables = {
    name: plan.name,
    returnUrl: `https://admin.shopify.com/store/${shopName}/apps/${SHOPIFY_ADMIN_APP_API_KEY}/`,
    trialDays,
    lineItems: [
      {
        plan: {
          appRecurringPricingDetails: {
            price: {
              amount: plan.price,
              currencyCode: 'USD'
            },
            interval: 'EVERY_30_DAYS'
          }
        }
      }
    ]
  };
  const result = await shopifyApiClient.request(query, { variables });
  const appSubscription = result.data.appSubscriptionCreate;

  // Update the shop plan details.
  shop.plan.name = plan.name;
  shop.plan.level = level;
  shop.plan.price = plan.price;
  shop.plan.chargeId = appSubscription.id;
  shop.plan.billingOn = undefined;
  shop.plan.startedAt = undefined;
  shop.plan.canceledAt = undefined;
  shop.plan.monthUpsellRevenue = 0;
  shop.plan.monthUpsellRevenueLimit = plan.monthUpsellRevenueLimit;
  shop.plan.active = false; // Not active until shop owner approves.

  await shop.save();

  await logger.info(
    `Successfully changed plan for shop to "${level}" and created new recurring charge ${
      appSubscription.id
    } (${shop.toString()})`,
    { appSubscription }
  );

  const redirectUrl = appSubscription.confirmationUrl;

  return redirectUrl;
};

const changePlan = async (shop, level) => {
  try {
    const redirectUrl = isSandbox ? createSandboxPlan(shop) : createPlan(shop, level);

    return redirectUrl;
  } catch (error) {
    await logger.error(`Error changing plan for shop to "${level}" (${shop.toString()})`, error);
    throw error;
  }
};

module.exports = changePlan;

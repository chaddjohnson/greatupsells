const getenv = require('getenv');
const logger = require('@greatupsellslogger');

const { SHOPIFY_ADMIN_APP_API_KEY } = process.env;

const initiatePlanUpgrade = async (shop) => {
  try {
    // Do nothing if the shop is already upgraded.
    if (shop.plan.level !== 'FREE') {
      return;
    }

    await logger.info(
      `Creating recurring charge for shop (${shop.toString()})`
    );

    try {
      // Cancel any existing plan.
      if (shop.plan.chargeId) {
        await shop.cancelPlan();
      }
    } catch (error) {
      await logger.warn(
        `Unable to cancel existing recurring charge ${shop.plan.chargeId} for shop ${shop.domain}`,
        error
      );
    }

    const shopifyApiClient = shop.getShopifyApiClient();
    const recurringCharge = await shopifyApiClient.recurringApplicationCharge.create(
      {
        name: 'Premium Plan', // TODO
        price: 4.99, // TODO
        trial_days: 14, // TODO
        return_url: `https://${shop.domain}/admin/apps/${SHOPIFY_ADMIN_APP_API_KEY}/account/premium`, // TODO
        test: getenv.bool('SANDBOX', true) || null
      }
    );

    await logger.info(
      `Created recurring charge ${
        recurringCharge.id
      } for shop (${shop.toString()})`
    );

    // Track the plan charge ID.
    shop.plan.chargeId = recurringCharge.id;

    await shop.save();

    // Return the confirmation redirection URL.
    return recurringCharge.confirmation_url;
  } catch (error) {
    await logger.error(
      `Error creating recurring charge for shop ${shop.domain}`,
      error
    );
    throw error;
  }
};

module.exports = initiatePlanUpgrade;

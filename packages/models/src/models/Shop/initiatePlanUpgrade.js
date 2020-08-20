const getenv = require('getenv');
const logger = require('@neatowebsolutions/logger');

module.exports = async (shop) => {
  try {
    // Do nothing if the shop is already upgraded.
    if (shop.plan.level !== 'FREE') {
      return;
    }

    logger.info(`Creating recurring charge for shop ${shop.domain}`);

    // Cancel any existing plan.
    if (shop.plan.chargeId) {
      await shop.cancelPlan();
    }

    const shopifyApiClient = shop.getShopifyApiClient();
    const recurringCharge = await shopifyApiClient.recurringApplicationCharge.create(
      {
        name: 'Premium Plan', // TODO
        price: 4.99, // TODO
        trial_days: 14, // TODO
        return_url: `https://${shop.domain}/admin/apps/${process.env.SHOPIFY_API_KEY}/account/premium`, // TODO
        test: getenv.bool('SANDBOX', true) || null
      }
    );

    logger.info(
      `Created recurring charge ${recurringCharge.id} for shop ${shop.domain}`
    );

    // Save the plan charge ID.
    shop.plan.chargeId = recurringCharge.id;

    // Save shop changes, and return the confirmation redirection URL.
    await shop.save();

    return recurringCharge.confirmation_url;
  } catch (error) {
    logger.error(
      `Error creating recurring charge for shop ${shop.domain}`,
      error
    );
    throw error;
  }
};

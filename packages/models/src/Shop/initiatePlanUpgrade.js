const getenv = require('getenv');
const logger = require('@neatowebsolutions/logger');

module.exports = async (shop) => {
  const models = require('..');
  const Shop = await models.get('Shop');

  try {
    // Do nothing if the shop is already upgraded.
    if (shop.plan.level !== 'FREE') {
      return;
    }

    logger.info(`Creating recurring charge for shop (${shop.toString()})`);

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
      `Created recurring charge ${
        recurringCharge.id
      } for shop (${shop.toString()})`
    );

    // Save the plan charge ID.
    // Use one round trip to prevent write conflicts.
    await Shop.findByIdAndUpdate(shop.id, {
      'plan.chargeId': recurringCharge.id
    });

    // Return the confirmation redirection URL.
    return recurringCharge.confirmation_url;
  } catch (error) {
    logger.error(
      `Error creating recurring charge for shop ${shop.domain}`,
      error
    );
    throw error;
  }
};

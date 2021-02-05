const logger = require('@neatowebsolutions/upselling-logger');

const deactivate = async (shop) => {
  // Record when the uninstall occurred.
  shop.uninstalledAt = shop.uninstalledAt || Date.now();

  // Flag the shop as inactive.
  shop.active = false;

  // Remove the shop's access token as it is no longer valid, and we can no
  // longer interact with Shopify on behalf of the shop.
  shop.accessToken = null;

  await shop.save();
  await logger.info(`Deactivated shop (${shop.toString()})`);

  if (shop.shopifyPlan === 'cancelled') {
    await logger.info(`Shop closed (${shop.toString()})`);
  }
};

module.exports = deactivate;

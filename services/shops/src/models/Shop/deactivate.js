const logger = require('@neatowebsolutions/upselling-logger');

module.exports = async (shop) => {
  // Record when the uninstall occurred.
  shop.uninstalledAt = shop.uninstalledAt || Date.now();

  // Flag the shop as inactive.
  shop.active = false;

  // Remove the shop's access token as it is no longer valid, and we can no
  // longer interact with Shopify on behalf of the shop.
  shop.accessToken = null;

  // Mark the shop's plan as canceled (Shopify cancels plans automatically on uninstall).
  shop.canceledAt = shop.plan.canceledAt || Date.now();

  // Mark the shop's plan as downgraded.
  shop.plan.level = 'FREE';
  shop.plan.chargeId = undefined;
  shop.plan.upgradedAt = undefined;
  shop.plan.billingOn = undefined;

  await shop.save();

  logger.info(`Deactivated shop (${shop.toString()})`);

  if (shop.shopifyPlan === 'cancelled') {
    logger.info(`Shop closed (${shop.toString()})`);
  }
};

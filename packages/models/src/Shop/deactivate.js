module.exports = async (shop) => {
  if (shop.active) {
    // Record when the uninstall occurred.
    shop.uninstalledAt = Date.now();
  }

  // Flag the shop as inactive.
  shop.active = false;

  // Remove the shop's access token.
  shop.accessToken = null;

  if (shop.plan.level !== 'FREE') {
    // Mark the shop's plan as canceled (Shopify cancels plans automatically on uninstall).
    shop.plan.canceledAt = Date.now();

    // Downgrade shop plan.
    shop.plan.level = 'FREE';
    shop.plan.active = false;
    shop.plan.chargeId = undefined;
    shop.plan.upgradedAt = undefined;
    shop.plan.billingOn = undefined;
    shop.plan.canceledAt = Date.now();
  }

  await shop.save();
};

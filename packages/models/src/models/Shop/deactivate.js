module.exports = async (shop) => {
  // Flag the shop as inactive.
  shop.active = false;

  // Remove the shop's access token.
  shop.accessToken = null;

  // Record when the uninstall occurred.
  shop.uninstalledAt = Date.now();

  // Mark the shop's plan as canceled (Shopify cancels plans automatically on uninstall).
  if (!shop.plan.grandfatheredAt && shop.plan.level === 'premium') {
    shop.plan.canceledAt = Date.now();
  }

  await shop.save();
};

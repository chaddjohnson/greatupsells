module.exports = async (shop) => {
  const models = require('..');
  const Shop = await models.get('Shop');

  // Use one round trip to prevent write conflicts.
  await Shop.findByIdAndUpdate(shop.id, {
    // Record when the uninstall occurred.
    uninstalledAt: shop.uninstalledAt || Date.now(),

    // Flag the shop as inactive.
    active: false,

    // Remove the shop's access token as it is no longer valid, and we can no
    // longer interact with Shopify on behalf of the shop.
    accessToken: null,

    // Mark the shop's plan as canceled (Shopify cancels plans automatically on uninstall).
    canceledAt: shop.plan.canceledAt || Date.now(),

    // Downgrade shop plan.
    'plan.level': 'FREE',
    'plan.chargeId': undefined,
    'plan.upgradedAt': undefined,
    'plan.billingOn': undefined
  });
};

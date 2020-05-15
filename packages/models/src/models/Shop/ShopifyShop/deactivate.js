module.exports = async (shop) => {
  const models = require('../..');
  const ShopifyShop = models.get('ShopifyShop');

  // Call the base method.
  await ShopifyShop.prototype.deactivate.call(this);

  // Mark the shop's plan as canceled (Shopify cancels plans automatically on uninstall).
  if (!shop.plan.grandfatheredAt && shop.plan.level === 'premium') {
    shop.plan.canceledAt = Date.now();
  }
};

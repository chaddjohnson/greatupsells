const prices = {
  free: 0,
  basic: 24,
  plus: 49,
  pro: 99
};

const limits = {
  free: 250,
  basic: 1000,
  plus: 2000,
  pro: undefined
};

const updateAppSubscription = async (shop, update) => {
  shop.plan = shop.plan || {};

  shop.plan.name = update.name;
  shop.plan.active = update.status === 'ACTIVE';
  shop.plan.level = update.plan_handle.toUpperCase();
  shop.plan.price = prices[update.plan_handle];
  shop.plan.chargeId = parseInt(update.admin_graphql_api_id.split('/').pop());
  shop.plan.currentPeriodEnd = new Date(update.currentPeriodEnd);
  shop.plan.createdAt = shop.plan.createdAt || Date.now();
  shop.plan.canceledAt = update.status === 'CANCELLED' ? shop.plan.canceledAt || Date.now : undefined;
  shop.plan.monthUpsellRevenue = shop.plan.monthUpsellRevenue || 0;
  shop.plan.monthUpsellRevenueLimit = limits[update.plan_handle] || undefined;

  await shop.save();
};

module.exports = updateAppSubscription;

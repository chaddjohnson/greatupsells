const resetPlan = async (shop) => {
  if (shop.plan.level) {
    shop.plan.canceledAt = Date.now();
  }

  // Mark the shop's plan as downgraded.
  shop.plan.name = undefined;
  shop.plan.level = undefined;
  shop.plan.price = undefined;
  shop.plan.active = false;
  shop.plan.chargeId = undefined;
  shop.plan.currentPeriodEnd = undefined;
  shop.plan.createdAt = undefined;
  shop.plan.monthUpsellRevenue = undefined;
  shop.plan.monthUpsellRevenueLimit = undefined;

  await shop.save();
};

module.exports = resetPlan;

const resetPlan = async (shop) => {
  if (shop.plan.level !== 'FREE') {
    shop.plan.canceledAt = Date.now();
  }

  // Mark the shop's plan as downgraded.
  shop.plan.level = 'FREE';
  shop.plan.price = 0.0;
  shop.plan.active = false;
  shop.plan.chargeId = undefined;
  shop.plan.upgradedAt = undefined;
  shop.plan.billingOn = undefined;

  await shop.save();
};

module.exports = resetPlan;

const logger = require('@greatupsells/logger');

const updatePlan = async (shop) => {
  if (!shop.plan.chargeId) {
    throw new Error(
      `Cannot update plan for shop as no recurring charge exists (${shop.toString()})`
    );
  }

  const shopifyApiClient = shop.getShopifyApiClient();
  const recurringChargeData =
    await shopifyApiClient.recurringApplicationCharge.get(shop.plan.chargeId);

  // Is the charge canceled?
  const chargeIsCanceled =
    recurringChargeData?.cancelled_on ||
    recurringChargeData?.status === 'cancelled';

  const billingOn =
    recurringChargeData.billing_on &&
    new Date(`${recurringChargeData.billing_on}T12:00:00Z`);
  const billingCycleActive = billingOn && new Date(billingOn) > new Date();

  // The plan should be removed if the charge canceled, was declined, or has expired (not accepted).
  const planIsInactive =
    !recurringChargeData ||
    chargeIsCanceled ||
    ['declined', 'expired'].includes(recurringChargeData.status);
  const resetPlan = !billingCycleActive && planIsInactive;

  // The plan should deactivated if the charge is frozen.
  const deactivatePlan =
    recurringChargeData?.status === 'frozen' && shop.plan.active;

  // The plan should be reactivated if the charge is active and the plan is inactive.
  const reactivatePlan =
    recurringChargeData?.status === 'active' && !shop.plan.active;

  // Track the next billing date.
  if (billingOn) {
    shop.plan.billingOn = billingOn;
  }

  if (resetPlan) {
    await logger.warn(
      `Resetting plan for shop as recurring charge is declined or expired (${shop.toString()})`
    );

    await shop.resetPlan();
  }

  if (deactivatePlan) {
    await logger.warn(
      `Deactivating plan for shop due to non-payment (${shop.toString()})`
    );

    shop.plan.active = false;
  }

  if (reactivatePlan) {
    await logger.warn(`Reactivating plan for shop (${shop.toString()})`, null, {
      plan: shop.plan
    });

    shop.plan.active = true;
  }

  await shop.save();
};

module.exports = updatePlan;

const logger = require('@greatupsellslogger');

const updatePlan = async (shop) => {
  if (!shop.plan.chargeId) {
    throw new Error(
      `Cannot update plan for shop as no recurring charge exists (${shop.toString()})`
    );
  }

  const shopifyApiClient = shop.getShopifyApiClient();
  const recurringChargeData = await shopifyApiClient.recurringApplicationCharge.get(
    shop.plan.chargeId
  );

  // Is the charge canceled?
  const chargeIsCanceled =
    recurringChargeData &&
    (recurringChargeData.cancelled_on ||
      recurringChargeData.status === 'cancelled');

  const billingCycleActive =
    shop.plan.billingOn && new Date(shop.plan.billingOn) > new Date();

  // The plan should be removed if the charge canceled, was declined, or has expired (not accepted).
  const planIsInactive =
    !recurringChargeData ||
    chargeIsCanceled ||
    ['declined', 'expired'].includes(recurringChargeData.status);
  const removePlan = !billingCycleActive && planIsInactive;

  // The plan should deactivated if the charge is frozen.
  const deactivatePlan =
    recurringChargeData &&
    recurringChargeData.status === 'frozen' &&
    shop.plan.active;

  // The plan should be reactivated if the charge is active and the plan is inactive.
  const reactivatePlan =
    recurringChargeData &&
    recurringChargeData.status === 'active' &&
    !shop.plan.active;

  if (removePlan) {
    await logger.warn(
      `Downgrading plan for shop ${shop.domain} as recurring charge is declined or expired`
    );

    await shop.resetPlan();
  }

  if (deactivatePlan) {
    await logger.warn(
      `Deactivating plan for shop ${shop.domain} due to non-payment`
    );

    shop.plan.active = false;
  }

  if (reactivatePlan) {
    await logger.warn(`Reactivating plan for shop ${shop.domain}`);

    shop.plan.active = true;
  }

  await shop.save();
};

module.exports = updatePlan;

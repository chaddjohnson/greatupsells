const logger = require('@neatowebsolutions/logger');

module.exports = async (shop) => {
  const models = require('..');
  const Shop = await models.get('Shop');

  try {
    if (!shop.plan.chargeId) {
      throw new Error(
        `Cannot update plan for shop ${shop.domain} as no recurring charge exists`
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
      logger.warn(
        `Downgrading plan for shop ${shop.domain} as recurring charge is declined or expired`
      );

      shop.plan.level = 'FREE';
      shop.plan.active = false;
      shop.plan.chargeId = undefined;
      shop.plan.upgradedAt = undefined;
      shop.plan.billingOn = undefined;
      shop.plan.canceledAt = undefined;
    }

    if (deactivatePlan) {
      logger.warn(
        `Deactivating plan for shop ${shop.domain} due to non-payment`
      );

      shop.plan.active = false;
    }

    if (reactivatePlan) {
      logger.warn(`Reactivating plan for shop ${shop.domain}`);

      shop.plan.active = true;
    }

    if (shop.isModified()) {
      // Use one round trip to prevent write conflicts.
      await Shop.findByIdAndUpdate(shop.id, shop.getChanges());
    }
  } catch (error) {
    logger.warn(
      `Unable to verify and update plan statuses for shop ${shop.domain}`,
      error
    );
    throw error;
  }
};

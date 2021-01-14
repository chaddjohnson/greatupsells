const logger = require('@neatowebsolutions/upselling-logger');

const cancelPlan = async (shop) => {
  try {
    if (!shop.plan.chargeId) {
      return;
    }

    const shopifyApiClient = shop.getShopifyApiClient();
    const recurringChargeData = await shopifyApiClient.recurringApplicationCharge.get(
      shop.plan.chargeId
    );
    const planActive =
      recurringChargeData &&
      recurringChargeData.activated_on &&
      !recurringChargeData.cancelled_on;

    // Cancel the plan if it was activated and not canceled.
    if (planActive) {
      await logger.info(
        `Canceling recurring charge ${shop.plan.chargeId} for shop ${shop.domain}`
      );

      try {
        await shopifyApiClient.recurringApplicationCharge.delete(
          shop.plan.chargeId
        );

        await logger.info(
          `Canceled recurring charge ${shop.plan.chargeId} for shop ${shop.domain}`
        );
      } catch (error) {
        await logger.error(
          `Error canceling existing recurring charge ${shop.plan.chargeId} for shop ${shop.domain}`,
          error
        );
      }
    }

    // Mark the shop's plan as downgraded.
    shop.plan.level = 'FREE';
    shop.plan.active = false;
    shop.plan.chargeId = undefined;
    shop.plan.upgradedAt = undefined;
    shop.plan.billingOn = undefined;
    shop.plan.canceledAt = Date.now();

    await shop.save();
  } catch (error) {
    await logger.warn(
      `Error retrieving recurring charge ${shop.plan.chargeId} for shop ${shop.domain}`,
      error
    );
  }
};

module.exports = cancelPlan;

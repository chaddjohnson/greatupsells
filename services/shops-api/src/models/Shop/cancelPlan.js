const logger = require('@neatowebsolutions/greatupsells-logger');

const cancelPlan = async (shop) => {
  if (!shop.plan.chargeId) {
    await shop.resetPlan();
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

  await shop.resetPlan();
};

module.exports = cancelPlan;

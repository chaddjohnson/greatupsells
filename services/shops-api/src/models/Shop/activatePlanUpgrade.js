const logger = require('@greatupsells/logger');

const activatePlanUpgrade = async (shop) => {
  const shopifyApiClient = shop.getShopifyApiClient();

  try {
    // Do nothing if the shop is already upgraded.
    if (shop.plan.level !== 'FREE') {
      return;
    }

    if (!shop.plan.chargeId) {
      throw new Error(
        `Cannot activate recurring charge for shop ${shop.domain} as no recurring charge has been initiated`
      );
    }

    await logger.info(`Activating recurring charge for shop ${shop.domain}`);

    let recurringChargeData = await shopifyApiClient.recurringApplicationCharge.get(
      shop.plan.chargeId
    );

    if (recurringChargeData.status === 'declined') {
      await logger.info(
        `Aborting activation for recurring charge ${shop.plan.chargeId} for shop ${shop.domain}`
      );

      // Mark the shop's plan as downgraded.
      return await shop.resetPlan();
    }

    if (recurringChargeData.status !== 'accepted') {
      throw new Error(
        `Unhandled recurring charge status "${recurringChargeData.status}"`
      );
    }

    recurringChargeData = await shopifyApiClient.recurringApplicationCharge.activate(
      shop.plan.chargeId,
      recurringChargeData
    );

    // Update the shop's plan.
    shop.plan.level = 'premium'; // TODO
    // shop.plan.price = ?; // TODO
    shop.plan.active = true;
    shop.plan.upgradedAt = Date.now();
    shop.plan.billingOn = new Date(recurringChargeData.billing_on);
    shop.plan.canceledAt = undefined;

    await shop.save();

    await logger.info(
      `Activated recurring charge ${shop.plan.chargeId} for shop ${shop.domain} and set plan to ${shop.plan.level}`,
      { recurringChargeData }
    );
  } catch (error) {
    await logger.error(
      `Error activating recurring charge for shop ${shop.domain}`,
      error
    );

    throw error;
  }
};

module.exports = activatePlanUpgrade;

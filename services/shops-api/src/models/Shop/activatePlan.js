const logger = require('@greatupsells/logger');

const activatePlan = async (shop) => {
  const shopifyApiClient = shop.getShopifyApiClient();

  try {
    if (!shop.plan.chargeId) {
      throw new Error(
        `Cannot activate recurring charge for shop as no recurring charge has been initiated (${shop.toString()})`
      );
    }

    const recurringCharge = await shopifyApiClient.recurringApplicationCharge.get(shop.plan.chargeId);

    if (recurringCharge.status === 'declined') {
      await logger.info(
        `Aborting activation for declined recurring charge ${shop.plan.chargeId} for shop (${shop.toString()})`
      );

      // Mark the shop's plan as downgraded.
      return await shop.resetPlan();
    }

    if (recurringCharge.status !== 'active') {
      throw new Error(`Unhandled recurring charge status "${recurringCharge.status}"`);
    }

    // Update the shop plan details.
    shop.plan.billingOn = new Date(recurringCharge.billing_on);
    shop.plan.startedAt = Date.now();
    shop.plan.trialStartedAt = shop.plan.trialStartedAt || Date.now();
    shop.plan.trialDays = shop.plan.trialDays || 7;
    shop.plan.active = true;
    await shop.save();

    await logger.info(`Activated recurring charge ${shop.plan.chargeId} for shop (${shop.toString()})`, { recurringCharge });
  } catch (error) {
    await logger.error(`Error activating recurring charge for shop (${shop.toString()})`, error);

    throw error;
  }
};

module.exports = activatePlan;

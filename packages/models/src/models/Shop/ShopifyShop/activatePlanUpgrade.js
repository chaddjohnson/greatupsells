const logger = require('@neatowebsolutions/logger');

module.exports = async (shop) => {
  try {
    // Do nothing if the shop is already upgraded.
    if (shop.plan.level === 'premium') {
      return;
    }

    if (!shop.plan.chargeId) {
      throw new Error(
        `Cannot activate recurring charge for shop ${shop.domain} as no recurring charge has been initiated`
      );
    }

    logger.info(
      `Activating recurring charge for premium upgrade for shop ${shop.domain}`
    );

    const shopifyApiClient = shop.getShopifyApiClient();
    let recurringChargeData = await shopifyApiClient.recurringApplicationCharge.get(
      shop.plan.chargeId
    );

    if (recurringChargeData.status === 'declined') {
      logger.info(
        `Aborting activation for recurring charge ${shop.plan.chargeId} for shop ${shop.domain}`
      );

      shop.plan.level = 'FREE';
      shop.plan.active = false;
      shop.plan.chargeId = undefined;
      shop.plan.upgradedAt = undefined;

      return await shop.save();
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

    // Flag the shop as in premium mode.
    shop.plan.level = 'premium';
    shop.plan.active = true;
    shop.plan.upgradedAt = Date.now();
    shop.plan.billingOn = new Date(recurringChargeData.billing_on);
    shop.plan.canceledAt = undefined;

    await shop.save();

    logger.info(
      `Activated recurring charge ${shop.plan.chargeId} for premium upgrade for shop ${shop.domain}`,
      recurringChargeData
    );
  } catch (error) {
    logger.error(
      `Error activating recurring charge for premium upgrade for shop ${shop.domain}`,
      error
    );
    throw error;
  }
};

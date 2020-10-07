const logger = require('@neatowebsolutions/logger');

module.exports = async (shop) => {
  try {
    if (!shop.plan.chargeId) {
      return;
    }

    const models = require('..');
    const Shop = await models.get('Shop');
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
      logger.info(
        `Cancelling recurring charge ${shop.plan.chargeId} for shop ${shop.domain}`
      );

      try {
        await shopifyApiClient.recurringApplicationCharge.delete(
          shop.plan.chargeId
        );

        logger.info(
          `Cancelled recurring charge ${shop.plan.chargeId} for shop ${shop.domain}`
        );
      } catch (error) {
        logger.error(
          `Error cancelling existing recurring charge ${shop.plan.chargeId} for shop ${shop.domain}`,
          error
        );
      }
    }

    // Use one round trip to prevent write conflicts.
    await Shop.findByIdAndUpdate(shop.id, {
      'plan.level': 'FREE',
      'plan.active': false,
      'plan.chargeId': undefined,
      'plan.upgradedAt': undefined,
      'plan.billingOn': undefined,
      'plan.canceledAt': Date.now()
    });
  } catch (error) {
    logger.warn(
      `Error retrieving recurring charge ${shop.plan.chargeId} for shop ${shop.domain}`,
      error
    );
  }
};

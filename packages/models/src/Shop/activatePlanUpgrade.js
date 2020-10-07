const logger = require('@neatowebsolutions/logger');

module.exports = async (shop) => {
  const models = require('..');
  const Shop = await models.get('Shop');

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

    logger.info(`Activating recurring charge for shop ${shop.domain}`);

    const shopifyApiClient = shop.getShopifyApiClient();
    let recurringChargeData = await shopifyApiClient.recurringApplicationCharge.get(
      shop.plan.chargeId
    );

    if (recurringChargeData.status === 'declined') {
      logger.info(
        `Aborting activation for recurring charge ${shop.plan.chargeId} for shop ${shop.domain}`
      );

      // Use one round trip to prevent write conflicts.
      return await Shop.findByIdAndUpdate(shop.id, {
        'plan.level': 'FREE',
        'plan.active': false,
        'plan.chargeId': undefined,
        'plan.upgradedAt': undefined
      });
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

    // Update shop plan.
    // Use one round trip to prevent write conflicts.
    await Shop.findByIdAndUpdate(shop.id, {
      'plan.level': 'premium', // TODO
      'plan.active': true,
      'plan.upgradedAt': Date.now(),
      'plan.billingOn': new Date(recurringChargeData.billing_on),
      'plan.canceledAt': undefined
    });

    logger.info(
      `Activated recurring charge ${shop.plan.chargeId} for for shop ${shop.domain}`,
      recurringChargeData
    );
  } catch (error) {
    logger.error(
      `Error activating recurring charge for shop ${shop.domain}`,
      error
    );

    throw error;
  }
};

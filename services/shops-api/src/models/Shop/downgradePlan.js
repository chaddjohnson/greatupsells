const logger = require('@neatowebsolutions/greatupsells-logger');

const downgradePlan = async (shop) => {
  try {
    // Do nothing if the shop is already downgraded.
    if (shop.plan === 'FREE') {
      return;
    }

    await shop.cancelPlan();

    await logger.info(`Successfully downgraded plan for shop ${shop.domain}`);
  } catch (error) {
    await logger.error(`Error downgrading plan for shop ${shop.domain}`, error);
    throw error;
  }
};

module.exports = downgradePlan;

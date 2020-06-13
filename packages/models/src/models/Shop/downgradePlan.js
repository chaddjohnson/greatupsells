const logger = require('@neatowebsolutions/logger');

module.exports = async (shop) => {
  try {
    // Do nothing if the shop is already downgraded.
    if (shop.plan === 'FREE') {
      return;
    }

    await shop.cancelPlan();

    logger.info(`Successfully downgraded plan for shop ${shop.domain}`);
  } catch (error) {
    logger.error(`Error downgrading plan for shop ${shop.domain}`, error);
    throw error;
  }
};

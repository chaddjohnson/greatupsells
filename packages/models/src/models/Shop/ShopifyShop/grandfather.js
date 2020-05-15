const logger = require('@neatowebsolutions/logger');

module.exports = async (shop) => {
  shop.plan = {
    level: 'premium',
    active: true,
    upgradedAt: Date.now(),
    grandfatheredAt: Date.now()
  };

  await shop.save();

  logger.info(`Grandfathered plan for shop ${shop.domain}`);
};

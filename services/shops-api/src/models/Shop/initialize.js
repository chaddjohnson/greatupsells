const logger = require('@greatupsells/logger');
const createWebhooks = require('./createWebhooks');
const addScripts = require('./addScripts');
const checkThemeCompatibility = require('./checkThemeCompatibility');
const enqueueProductAndCollectionImport = require('./enqueueProductAndCollectionImport');

const dev = process.env.NODE_ENV !== 'production';

const initialize = async (shop) => {
  await logger.info(`(Re)initializing shop (${shop.toString()})`);

  if (dev) {
    shop.active = true;
    shop.plan.name = 'Pro';
    shop.plan.level = 'PRO';
    shop.plan.price = 99.0;
    shop.plan.active = true;
  }

  await Promise.all([createWebhooks(shop), addScripts(shop), checkThemeCompatibility(shop)]);
  await enqueueProductAndCollectionImport(shop);
};

module.exports = initialize;

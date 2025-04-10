const logger = require('@greatupsells/logger');
const createWebhooks = require('./createWebhooks');
const addScripts = require('./addScripts');
const checkThemeCompatibility = require('./checkThemeCompatibility');
const enqueueProductAndCollectionImport = require('./enqueueProductAndCollectionImport');

const initialize = async (shop) => {
  await logger.info(`(Re)initializing shop (${shop.toString()})`);

  await Promise.all([createWebhooks(shop), addScripts(shop), checkThemeCompatibility(shop)]);
  await enqueueProductAndCollectionImport(shop);
};

module.exports = initialize;

const logger = require('@greatupsells/logger');
const createWebhooks = require('./createWebhooks');
const addScripts = require('./addScripts');
const checkThemeCompatibility = require('./checkThemeCompatibility');
const enqueueProductAndCollectionImport = require('./enqueueProductAndCollectionImport');

const initialize = async (shop) => {
  await logger.info(`(Re)initializing shop (${shop.toString()})`);

  // Execute these sequentially to avoid rate limiting with Shopify's API.
  await createWebhooks(shop);
  await addScripts(shop);
  await checkThemeCompatibility(shop);
  await enqueueProductAndCollectionImport(shop);
};

module.exports = initialize;

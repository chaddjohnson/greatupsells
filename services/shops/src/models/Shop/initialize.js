const logger = require('@neatowebsolutions/upselling-logger');
const createWebhooks = require('./createWebhooks');
const addScripts = require('./addScripts');
const enqueueUpdateShopifyTheme = require('./enqueueUpdateShopifyTheme');
const enqueueCollectionImport = require('./enqueueCollectionImport');
const enqueueProductImport = require('./enqueueProductImport');

const initialize = async (shop) => {
  await logger.info(`(Re)initializing shop (${shop.toString()})`);

  await createWebhooks(shop);
  await addScripts(shop);
  await enqueueUpdateShopifyTheme(shop);
  await enqueueCollectionImport(shop);
  await enqueueProductImport(shop);
};

module.exports = initialize;

const logger = require('@neatowebsolutions/upselling-logger');
const createWebhooks = require('./createWebhooks');
const addScripts = require('./addScripts');
const addProductTypeRule = require('./addProductTypeRule');
const enqueueCollectionImport = require('./enqueueCollectionImport');
const enqueueProductImport = require('./enqueueProductImport');

const initialize = async (shop) => {
  await logger.info(`(Re)initializing shop (${shop.toString()})`);

  await createWebhooks(shop);
  await addScripts(shop);
  await addProductTypeRule(shop);
  await enqueueCollectionImport(shop);
  await enqueueProductImport(shop);
};

module.exports = initialize;

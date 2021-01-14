const logger = require('@neatowebsolutions/upselling-logger');
const createWebhooks = require('./createWebhooks');
const addScripts = require('./addScripts');
const addProductTypeRule = require('./addProductTypeRule');
const importCollections = require('./importCollections');
const importProducts = require('./importProducts');

const initialize = async (shop) => {
  await logger.info(`(Re)initializing shop (${shop.toString()})`);

  await createWebhooks(shop);
  await addScripts(shop);
  await addProductTypeRule(shop);
  await importCollections(shop);
  await importProducts(shop);
};

module.exports = initialize;

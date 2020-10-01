const logger = require('@neatowebsolutions/logger');
const createWebhooks = require('./createWebhooks');
const addScripts = require('./addScripts');
const addProductTypeRule = require('./addProductTypeRule');
const importCollections = require('./importCollections');
const importProducts = require('./importProducts');

module.exports = async (shop) => {
  logger.info(`Initializing shop (${shop.toString()})`);

  await createWebhooks(shop);
  await addScripts(shop);
  await addProductTypeRule(shop);
  await importCollections(shop);
  await importProducts(shop);
};

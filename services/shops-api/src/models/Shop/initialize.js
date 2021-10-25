const logger = require('@neatowebsolutions/greatupsells-logger');
const createWebhooks = require('./createWebhooks');
const addScripts = require('./addScripts');
const enqueueCollectionImport = require('./enqueueCollectionImport');
const enqueueProductImport = require('./enqueueProductImport');

const initialize = async (shop) => {
  await logger.info(`(Re)initializing shop (${shop.toString()})`);

  await Promise.all([
    createWebhooks(shop),
    addScripts(shop),
    enqueueCollectionImport(shop),
    enqueueProductImport(shop)
  ]);
};

module.exports = initialize;

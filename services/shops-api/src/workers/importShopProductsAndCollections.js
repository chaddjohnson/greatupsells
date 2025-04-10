const logger = require('@greatupsells/logger');
const models = require('../models');
const enqueueOrderImport = require('../models/Shop/enqueueOrderImport');

const processRecord = async (record) => {
  const body = JSON.parse(record.body);
  const { shopId } = body;
  const Shop = await models.get('Shop');
  const shop = await Shop.findById(shopId);

  await shop.importCollections();
  await shop.importProducts();

  await shop.trackCollectionProducts();
  await shop.trackProductCollections();

  // Import orders after importing products as orders depend on products.
  await enqueueOrderImport(shop);
};

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const results = await Promise.allSettled(event.Records.map(processRecord));
    const anyFailed = results.some(({ status }) => status === 'rejected');
    const error = results.find(({ status }) => status === 'rejected')?.reason;

    if (anyFailed) {
      throw error;
    }
  } catch (error) {
    await logger.error(`Job importShopProductsAndCollections failed`, error, { event });
    throw error;
  }
};

module.exports.handler = handler;

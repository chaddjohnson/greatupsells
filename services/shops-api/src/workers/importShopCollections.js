const logger = require('@greatupsells/logger');
const models = require('../models');

const processRecord = async (record) => {
  const body = JSON.parse(record.body);
  const { shopId } = body;
  const Shop = await models.get('Shop');
  const shop = await Shop.findById(shopId);

  await shop.importCollections();
};

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await Promise.allSettled(event.Records.map(processRecord));
  } catch (error) {
    await logger.error(`Job importShopCollections failed`, error, { event });
    throw error;
  }
};

module.exports.handler = handler;

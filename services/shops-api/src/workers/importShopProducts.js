const logger = require('@greatupsells/logger');
const models = require('../models');

const processRecord = async (record) => {
  const body = JSON.parse(record.body);
  const { shopId } = body;
  const Shop = await models.get('Shop');
  const shop = await Shop.findById(shopId);

  await shop.importProducts();
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
    await logger.error(`Job importShopProducts failed`, error, { event });
    throw error;
  }
};

module.exports.handler = handler;

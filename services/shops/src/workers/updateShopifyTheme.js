const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

const processRecord = async (record) => {
  const body = JSON.parse(record.body);
  const { shopId } = body;
  const Shop = await models.get('Shop');
  const shop = await Shop.findById(shopId);

  await shop.updateShopifyTheme();
};

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await Promise.all(event.Records.map(processRecord));
  } catch (error) {
    await logger.error(`Job updateShopifyTheme failed`, error, event);
    throw error;
  }
};

module.exports.handler = handler;

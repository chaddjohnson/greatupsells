const logger = require('@neatowebsolutions/greatupsells-logger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const Shop = await models.get('Shop');

    await Shop.fixWebhooks();
  } catch (error) {
    await logger.warn(`Job fixShopWebhooks failed`, error, { event });
    throw error;
  }
};

module.exports.handler = handler;

const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await logger.info(`Running job updateShopPlans`);

  try {
    const Shop = await models.get('Shop');

    await Shop.updatePlans();
  } catch (error) {
    await logger.warn(`Job updateShopPlans failed`, error, event);
    throw error;
  }
};

module.exports.handler = handler;

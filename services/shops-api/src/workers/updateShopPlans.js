const logger = require('@greatupsellslogger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const Shop = await models.get('Shop');

    await Shop.updatePlans();
  } catch (error) {
    await logger.error(`Job updateShopPlans failed`, error, { event });
    throw error;
  }
};

module.exports.handler = handler;

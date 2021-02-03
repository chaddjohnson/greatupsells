const fs = require('fs-extra');
const isLambda = require('is-lambda');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await logger.info(`Running job updateShopPlans`);

  try {
    if (isLambda) {
      await fs.emptyDir('/tmp');
    }

    const Shop = await models.get('Shop');

    await Shop.updatePlans();
  } catch (error) {
    await logger.warn(`Job updateShopPlans failed`, error, event);
    throw error;
  }
};

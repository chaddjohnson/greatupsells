const fs = require('fs-extra');
const isLambda = require('is-lambda');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await logger.info(`Running job updateShopActiveStatuses`);

  try {
    if (isLambda) {
      await fs.emptyDir('/tmp');
    }

    const Shop = await models.get('Shop');

    await Shop.updateActiveStatuses();
  } catch (error) {
    await logger.warn(`Job updateShopActiveStatuses failed`, error, event);
    throw error;
  }
};

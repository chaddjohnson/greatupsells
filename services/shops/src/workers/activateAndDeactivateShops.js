const fs = require('fs-extra');
const isLambda = require('is-lambda');
const models = require('@neatowebsolutions/upselling-models');
const logger = require('@neatowebsolutions/upselling-logger');

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  logger.info(`Running job activateAndDeactivateShops`);

  try {
    if (isLambda) {
      await fs.emptyDir('/tmp');
    }

    // const Shop = await models.get('Shop');

    // TODO: Run in parallel for shops.
    try {
      //
    } catch (error) {
      logger.error(`Error activating/deactivating shop ${shop.domain}`, error);
    }
  } catch (error) {
    logger.error(`Error activating/deactivating shop ${shop.domain}`, error);
    throw error;
  }
};

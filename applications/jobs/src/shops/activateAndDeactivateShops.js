const models = require('@neatowebsolutions/upselling-models');
const { logger, cleanTmp } = require('../utilities');

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  logger.info(`Running job activateAndDeactivateShops`);

  try {
    await cleanTmp();

    // const Shop = await models.get('Shop');

    // ...
    // TODO: Run in parallel for shops.
  } catch (error) {
    logger.warn(`... failed`, error, event);
    throw error;
  }
};

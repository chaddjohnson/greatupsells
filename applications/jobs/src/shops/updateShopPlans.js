const models = require('@neatowebsolutions/upselling-models');
const { logger, cleanTmp } = require('../utilities');

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  logger.info(`Running job updateShopPlans`);

  try {
    await cleanTmp();

    // const Shop = await models.get('Shop');

    // ...
  } catch (error) {
    logger.warn(`... failed`, error, event);
    throw error;
  }
};

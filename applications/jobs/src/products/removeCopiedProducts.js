const models = require('@neatowebsolutions/upselling-models');
const { logger, cleanTmp } = require('../utilities');

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  logger.info(`Running job removeCopiedProducts`);

  try {
    await cleanTmp();

    const Product = await models.get('Product');

    await Product.removeCopiedProducts();
  } catch (error) {
    logger.warn(`... failed`, error, event);
    throw error;
  }
};

const fs = require('fs-extra');
const isLambda = require('is-lambda');
const models = require('@neatowebsolutions/upselling-models');
const logger = require('@neatowebsolutions/upselling-logger');

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  logger.info(`Running job removeCopiedProducts`);

  try {
    if (isLambda) {
      await fs.emptyDir('/tmp');
    }

    const Product = await models.get('Product');

    await Product.removeCopiedProducts();
  } catch (error) {
    logger.warn(`... failed`, error, event);
    throw error;
  }
};

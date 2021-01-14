const fs = require('fs-extra');
const isLambda = require('is-lambda');
const logger = require('@neatowebsolutions/upselling-logger');

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await logger.info(`Running job removeCopiedProducts`);

  try {
    if (isLambda) {
      await fs.emptyDir('/tmp');
    }

    const Product = await models.get('Product');

    await Product.removeCopiedProducts();
  } catch (error) {
    await logger.warn(`... failed`, error, event);
    throw error;
  }
};

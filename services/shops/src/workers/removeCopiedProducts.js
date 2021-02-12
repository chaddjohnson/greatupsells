const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await logger.info(`Running job removeCopiedProducts`);

  try {
    const Product = await models.get('Product');

    await Product.removeCopiedProducts();
  } catch (error) {
    await logger.warn(`... failed`, error, event);
    throw error;
  }
};

module.exports.handler = handler;

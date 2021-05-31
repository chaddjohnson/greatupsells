const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const Product = await models.get('Product');

    await Product.removeCopiedProducts();
  } catch (error) {
    await logger.error(`Job removeCopiedProducts failed`, error, { event });
    throw error;
  }
};

module.exports.handler = handler;

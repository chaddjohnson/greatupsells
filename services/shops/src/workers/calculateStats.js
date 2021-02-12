const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await logger.info(`Running job calculateStats`);

  try {
    const Stats = await models.get('Stats');

    await Stats.calculateToday();
  } catch (error) {
    await logger.error(`Error alculating status for today`, error, event);
    throw error;
  }
};

module.exports.handler = handler;

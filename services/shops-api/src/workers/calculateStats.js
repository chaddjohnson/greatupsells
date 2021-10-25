const logger = require('@greatupsellslogger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const Stats = await models.get('Stats');

    await Stats.calculateToday();
  } catch (error) {
    await logger.error(`Error alculating status for today`, error, { event });
    throw error;
  }
};

module.exports.handler = handler;

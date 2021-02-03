const fs = require('fs-extra');
const isLambda = require('is-lambda');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await logger.info(`Running job calculateStats`);

  try {
    if (isLambda) {
      await fs.emptyDir('/tmp');
    }

    const Stats = await models.get('Stats');

    await Stats.calculateToday();
  } catch (error) {
    await logger.warn(`Error alculating status for today`, error, event);
    throw error;
  }
};

const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@greatupsells/logger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const Log = await models.get('Log');
    const { type, query, page, pageSize } = event.queryStringParameters || {};
    const logs = await Log.search(type, query, page, pageSize);

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(logs)
    };
  } catch (error) {
    await logger.error(`Error retrieving logs`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

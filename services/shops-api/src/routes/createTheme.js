const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@greatupsells/logger');
const mongodbClient = require('../models/mongodbClient');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await mongodbClient.connect();

  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  try {
    const Theme = await models.get('Theme');
    const data = JSON.parse(event.body);
    const theme = new Theme(data);

    try {
      await theme.validate();
    } catch (error) {
      logger.debug(`ERROR: ${error.message}`);

      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: ReasonPhrases.BAD_REQUEST
      };
    }

    await theme.save();

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(theme)
    };
  } catch (error) {
    await logger.error(`Error creating theme`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

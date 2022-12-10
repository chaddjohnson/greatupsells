const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@greatupsells/logger');
const mongodbClient = require('../models/mongodbClient');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await mongodbClient.connect();

  try {
    const { themeId } = event.pathParameters;
    const Theme = await models.get('Theme');
    let theme = await Theme.findById(themeId);
    const data = JSON.parse(event.body);

    if (!theme) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    delete data.__v;

    try {
      await theme.replaceOne(data);
    } catch (error) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: ReasonPhrases.BAD_REQUEST
      };
    }

    // Refresh document, and force middleware to run.
    theme = await Theme.findById(themeId);
    await theme.save();

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(theme)
    };
  } catch (error) {
    await logger.error(`Error updating theme`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

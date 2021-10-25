const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@greatupsellslogger');
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
    const PopupTheme = await models.get('PopupTheme');
    const popupThemes = await PopupTheme.find({
      shop: null,
      offer: null
    }).sort({ displayOrder: 1 });

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(popupThemes)
    };
  } catch (error) {
    await logger.error(`Error retrieving popup themes`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

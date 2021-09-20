const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

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
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

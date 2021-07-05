const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { popupThemeId } = event.pathParameters;
    const PopupTheme = await models.get('PopupTheme');
    const popupTheme = await PopupTheme.findById(popupThemeId);
    let clonedPopupTheme = null;

    if (!popupTheme) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    clonedPopupTheme = await popupTheme.clone();

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(clonedPopupTheme)
    };
  } catch (error) {
    await logger.error(`Error cloning popup theme`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

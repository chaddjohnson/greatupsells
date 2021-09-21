const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

const handler = async (event, context) => {
  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { popupThemeId } = event.pathParameters;
    const PopupTheme = await models.get('PopupTheme');
    const popupTheme = await PopupTheme.findById(popupThemeId);
    const data = JSON.parse(event.body);

    if (!popupTheme) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    delete data.__v;
    Object.assign(popupTheme, data);

    try {
      await popupTheme.validate();
    } catch (error) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: ReasonPhrases.BAD_REQUEST
      };
    }

    await popupTheme.save();

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(popupTheme)
    };
  } catch (error) {
    await logger.error(`Error updating popup theme`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

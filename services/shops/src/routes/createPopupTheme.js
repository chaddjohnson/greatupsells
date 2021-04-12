const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const PopupTheme = await models.get('PopupTheme');
    const data = JSON.parse(event.body);
    const popupTheme = new PopupTheme(data);

    try {
      await popupTheme.validate();
    } catch (error) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: ReasonPhrases.BAD_REQUEST
      };
    }

    await popupTheme.save();
    await logger.debug(`Popup theme created`, popupTheme);

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(popupTheme)
    };
  } catch (error) {
    await logger.error(`Error creating popup theme`, error, event);

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

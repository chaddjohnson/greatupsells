const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

let counter = 1;

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  counter += 1;
  console.log(`counter = ${counter}`); // eslint-disable-line no-console

  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUp - Lambda is warm!'); // eslint-disable-line no-console
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  console.log('Normal request'); // eslint-disable-line no-console

  try {
    const { popupThemeId } = event.pathParameters;
    const PopupTheme = await models.get('PopupTheme');
    const popupTheme = await PopupTheme.findById(popupThemeId);

    if (!popupTheme) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(popupTheme)
    };
  } catch (error) {
    await logger.error(`Error retrieving popup theme`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

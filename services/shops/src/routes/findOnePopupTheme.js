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

  console.log('Normal request 1'); // eslint-disable-line no-console

  try {
    console.log('Normal request 2'); // eslint-disable-line no-console
    const { popupThemeId } = event.pathParameters;
    console.log('Normal request 3'); // eslint-disable-line no-console
    const PopupTheme = await models.get('PopupTheme');
    console.log('Normal request 4'); // eslint-disable-line no-console
    const popupTheme = await PopupTheme.findById(popupThemeId);
    console.log('Normal request 5'); // eslint-disable-line no-console

    if (!popupTheme) {
      console.log('Normal request 6'); // eslint-disable-line no-console
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }
    console.log('Normal request 7'); // eslint-disable-line no-console

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(popupTheme)
    };
  } catch (error) {
    console.log('Normal request 8'); // eslint-disable-line no-console
    await logger.error(`Error retrieving popup theme`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

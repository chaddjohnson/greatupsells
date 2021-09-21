const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  try {
    const { domain } = event.pathParameters;
    const { accessToken } = JSON.parse(event.body);
    const Shop = await models.get('Shop');
    const shop = await Shop.createOrUpdate(domain, accessToken);

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(shop)
    };
  } catch (error) {
    await logger.error(`Error (re)initializing shop`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

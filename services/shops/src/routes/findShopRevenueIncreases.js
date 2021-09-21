const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUp - Lambda is warm!'); // eslint-disable-line no-console
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  try {
    const { shopId } = event.pathParameters;
    const { startAt, endAt } = event.queryStringParameters || {};
    const Shop = await models.get('Shop');
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    const shopRevenueIncreases = await shop.findRevenueIncreases(
      startAt,
      endAt
    );

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(shopRevenueIncreases)
    };
  } catch (error) {
    await logger.error(`Error retrieving shop revenue increases`, error, {
      event
    });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@greatupsells/logger');
const mongodbClient = require('../models/mongodbClient');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await mongodbClient.connect();

  try {
    const { shopId } = event.pathParameters;
    const { level } = JSON.parse(event.body);
    const Shop = await models.get('Shop');
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    const redirectUrl = await shop.changePlan(level);

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify({ redirectUrl })
    };
  } catch (error) {
    await logger.error(`Error changing shop plan`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

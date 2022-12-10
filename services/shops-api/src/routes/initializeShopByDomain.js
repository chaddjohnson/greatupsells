const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@greatupsells/logger');
const mongodbClient = require('../models/mongodbClient');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await mongodbClient.connect();

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
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

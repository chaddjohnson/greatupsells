const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@greatupsells/logger');
const mongodbClient = require('../models/mongodbClient');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await mongodbClient.connect();

  try {
    const { shopId } = event.pathParameters;
    const { query, status } = event.queryStringParameters || {};
    const Shop = await models.get('Shop');
    const shop = await Shop.findById(shopId);
    const offers = await shop.searchOffers({ query, status });

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(offers)
    };
  } catch (error) {
    await logger.error(`Error retrieving shop offers`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

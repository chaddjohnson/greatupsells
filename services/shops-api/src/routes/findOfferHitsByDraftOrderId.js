const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@greatupsells/logger');
const mongodbClient = require('../models/mongodbClient');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await mongodbClient.connect();

  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  try {
    const { shopifyDraftOrderId } = event.pathParameters;
    const OfferHit = await models.get('OfferHit');
    const offerHits = await OfferHit.find({ shopifyDraftOrderId });

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(offerHits)
    };
  } catch (error) {
    await logger.error(
      `Error retrieving offer hits for Shopify draft order`,
      error,
      { event }
    );

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

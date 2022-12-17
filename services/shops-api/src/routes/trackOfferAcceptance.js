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
    const OfferHit = await models.get('OfferHit');
    const {
      offerHitId,
      shopifyDraftOrderId,
      shopifyCheckoutId,
      items
    } = JSON.parse(event.body);
    const offerHit = await OfferHit.findById(offerHitId);

    if (!offerHitId) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    await offerHit.trackAcceptance(items, {
      shopifyDraftOrderId,
      shopifyCheckoutId
    });

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(offerHit)
    };
  } catch (error) {
    await logger.error(`Error tracking offer acceptance`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

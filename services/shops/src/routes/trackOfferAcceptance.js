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
    const OfferHit = await models.get('OfferHit');
    const {
      offerHitId,
      shopifyProductId,
      shopifyVariantId,
      quantity
    } = JSON.parse(event.body);
    const offerHit = await OfferHit.findById(offerHitId);

    if (!offerHitId) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    await offerHit.trackAcceptance(
      shopifyProductId,
      shopifyVariantId,
      quantity
    );

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(offerHit)
    };
  } catch (error) {
    await logger.error(`Error tracking offer acceptance`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

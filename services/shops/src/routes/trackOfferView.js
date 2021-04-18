const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { offerId } = event.pathParameters;
    const Offer = await models.get('Offer');
    const offer = await Offer.findById(offerId);
    const { shopifyProductIds, shopifyVariantIds, ipAddress } = JSON.parse(
      event.body
    );

    if (!offer) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    const offerHit = await offer.trackView(
      shopifyProductIds,
      shopifyVariantIds,
      ipAddress
    );

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(offerHit)
    };
  } catch (error) {
    await logger.error(`Error tracking offer view`, error, event);

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

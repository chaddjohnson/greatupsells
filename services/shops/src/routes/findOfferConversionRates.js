const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { offerId } = event.pathParameters;
    const { startAt, endAt } = event.queryStringParameters;
    const Offer = await models.get('Offer');
    const offer = await Offer.findById(offerId);

    if (!offer) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    const offerConversionRates = await offer.findConversionRates(
      startAt,
      endAt
    );

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(offerConversionRates)
    };
  } catch (error) {
    logger.error(`Error retrieving offer conversion rates`, error, event);

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

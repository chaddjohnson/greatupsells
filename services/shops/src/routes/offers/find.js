const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const Offer = await models.get('Offer');
    const offers = await Offer.find({});

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(offers)
    };
  } catch (error) {
    logger.error(`Error retrieving offers`, error, event);

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

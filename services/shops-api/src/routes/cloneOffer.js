const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
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
    const { offerId } = event.pathParameters;
    const [Offer] = await Promise.all([
      models.get('Offer'),
      models.get('Shop')
    ]);
    const offer = await Offer.findById(offerId);

    if (!offer) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    const clonedOffer = await offer.clone();

    await clonedOffer.execPopulate('shop');
    await logger.info(`Offer cloned (${offer.toString()})`, { clonedOffer });

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(clonedOffer)
    };
  } catch (error) {
    await logger.error(`Error cloning offer`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

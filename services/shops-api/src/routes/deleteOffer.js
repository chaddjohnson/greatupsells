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
    const { offerId } = event.pathParameters;
    const [Offer, Theme] = await Promise.all([models.get('Offer'), models.get('Theme')]);
    const offer = await Offer.findById(offerId);

    if (!offer) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    // Delete themes associated with the offer.
    await Theme.deleteMany({ offer: offer._id });

    // Delete the offer.
    await Offer.findByIdAndDelete(offerId);

    await logger.info(`Offer deleted (${offer.toString()})`);

    return {
      statusCode: StatusCodes.NO_CONTENT
    };
  } catch (error) {
    await logger.error(`Error deleting offer`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

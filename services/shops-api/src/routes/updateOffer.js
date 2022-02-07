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
    const [Offer] = await Promise.all([
      models.get('Offer'),
      models.get('Shop')
    ]);
    let offer = await Offer.findById(offerId);
    const {
      impressionCount,
      acceptanceCount,
      conversionCount,
      conversionRate,
      revenueIncrease
    } = offer;
    const data = JSON.parse(event.body);

    if (!offer) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    delete data.__v;

    try {
      await offer.replaceOne({
        ...data,

        // Fields managed only by this API.
        impressionCount,
        acceptanceCount,
        conversionCount,
        conversionRate,
        revenueIncrease
      });
    } catch (error) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: ReasonPhrases.BAD_REQUEST
      };
    }

    // Refresh document, and force middleware to run.
    offer = await Offer.findById(offerId);
    await offer.save();

    await offer.execPopulate('shop');
    await logger.info(`Offer updated (${offer.toString()})`, { offer });

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(offer)
    };
  } catch (error) {
    await logger.error(`Error updating offer`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@greatupsells/logger');
const mongodbClient = require('../models/mongodbClient');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await mongodbClient.connect();

  try {
    const [Offer] = await Promise.all([
      models.get('Offer'),
      models.get('Shop')
    ]);
    const data = JSON.parse(event.body);

    delete data.impressionCount;
    delete data.acceptanceCount;
    delete data.conversionCount;
    delete data.conversionRate;
    delete data.revenueIncrease;

    const offer = new Offer(data);

    try {
      await offer.validate();
    } catch (error) {
      logger.debug(`ERROR: ${error.message}`);

      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: ReasonPhrases.BAD_REQUEST
      };
    }

    await offer.save();
    await offer.execPopulate('shop');

    await logger.info(`Offer created (${offer.toString()})`, { offer });

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(offer)
    };
  } catch (error) {
    await logger.error(`Error creating offer`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

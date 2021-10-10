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
    const { offerHitId } = event.pathParameters;
    const OfferHit = await models.get('OfferHit');
    const offerHit = await OfferHit.findById(offerHitId);
    const data = JSON.parse(event.body);

    if (!offerHit) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    delete data.__v;
    Object.assign(offerHit, data);

    try {
      await offerHit.validate();
    } catch (error) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: ReasonPhrases.BAD_REQUEST
      };
    }

    await offerHit.save();

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(offerHit)
    };
  } catch (error) {
    await logger.error(`Error updating offer hit`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@greatupsells/logger');
const mongodbClient = require('../models/mongodbClient');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await mongodbClient.connect();

  try {
    const { offerId } = event.pathParameters;
    const Offer = await models.get('Offer');
    const offer = await Offer.findById(offerId);
    const {
      triggerShopifyProductId,
      triggerShopifyVariantId,
      offeredShopifyProductIds,
      ipAddress,
      isTest
    } = JSON.parse(event.body);

    if (!offer) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    const offerHit = await offer.trackImpression({
      triggerShopifyProductId,
      triggerShopifyVariantId,
      offeredShopifyProductIds,
      ipAddress,
      isTest
    });

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(offerHit)
    };
  } catch (error) {
    await logger.error(`Error tracking offer impression`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

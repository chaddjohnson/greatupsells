const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { shopId } = event.pathParameters;
    const { event: triggerEvent } = event.queryStringParameters;
    const { shopifyProductIds } = event.multiValueQueryStringParameters;
    const Shop = await models.get('Shop');
    const Offer = await models.get('Offer');
    const shop = await Shop.findById(shopId);
    const offer = await Offer.findOneRandom(
      shop,
      triggerEvent,
      shopifyProductIds
    );

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(offer)
    };
  } catch (error) {
    await logger.error(`Error retrieving random offer for shop`, error, event);

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

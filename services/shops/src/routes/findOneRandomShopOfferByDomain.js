const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { domain } = event.pathParameters;
    const { event: triggerEvent } = event.queryStringParameters || {};
    const { shopifyProductIds } = event.multiValueQueryStringParameters || {};
    const Shop = await models.get('Shop');
    const Offer = await models.get('Offer');
    const shop = await Shop.findByDomain(domain);

    if (!shop) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    const offer = await Offer.findOneRandom(
      shop,
      triggerEvent,
      shopifyProductIds
    );

    if (!offer) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    const product = await offer.findOneRandomProduct();

    if (!product) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify({
        offer,
        product
      })
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

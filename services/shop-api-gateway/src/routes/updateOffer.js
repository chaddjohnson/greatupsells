const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const {
  StatusCodes,
  ReasonPhrases,
  getReasonPhrase
} = require('http-status-codes');
const HttpClient = require('@neatowebsolutions/upselling-http-client');
const logger = require('@neatowebsolutions/upselling-logger');

const { SHOPS_API_URL } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

const handler = middy(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { shopId } = event.requestContext.authorizer;
    const { offerId } = event.pathParameters;
    const offer = await httpClient.get(`/offers/${offerId}`);
    const offerShopId = offer.shop;
    const data = JSON.parse(event.body);

    if (shopId !== offerShopId) {
      await logger.warn(
        `Unauthorized update attempt for offer ${offerId}`,
        data,
        event
      );

      return {
        statusCode: StatusCodes.FORBIDDEN,
        body: ReasonPhrases.FORBIDDEN
      };
    }

    // Disallow updating specific fields.
    delete data.shopifyShopId;
    delete data.shop;
    delete data.viewCount;
    delete data.acceptanceCount;
    delete data.conversionCount;
    delete data.conversionRate;
    delete data.revenueIncrease;

    const updatedOffer = await httpClient.put(`/offers/${offerId}`, {
      ...offer,
      ...data
    });

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(updatedOffer)
    };
  } catch (error) {
    if (error.response && error.response.status) {
      return {
        statusCode: error.response.status,
        body: error.response.data || getReasonPhrase(error.response.status)
      };
    }

    await logger.error(`Error updating offer`, error, event);

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
});

handler.use(cors());

module.exports.handler = handler;

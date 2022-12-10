const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const {
  StatusCodes,
  ReasonPhrases,
  getReasonPhrase
} = require('http-status-codes');
const HttpClient = require('@greatupsells/gateway-http-client');
const logger = require('@greatupsells/logger');

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
    const offerShopId = offer && offer.shop;

    if (shopId !== offerShopId) {
      await logger.warn(
        `Unauthorized access attempt for offer ${offerId}`,
        null,
        { event }
      );

      return {
        statusCode: StatusCodes.FORBIDDEN,
        body: ReasonPhrases.FORBIDDEN
      };
    }

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(offer)
    };
  } catch (error) {
    if (error.response && error.response.status) {
      return {
        statusCode: error.response.status,
        body:
          JSON.stringify(error.response.data) ||
          getReasonPhrase(error.response.status)
      };
    }

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
});

handler.use(cors());

module.exports.handler = handler;

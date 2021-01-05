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

    if (shopId !== offerShopId) {
      logger.warn(`Unauthorized access attempt for offer ${offerId}`, event);

      return {
        statusCode: StatusCodes.FORBIDDEN,
        body: ReasonPhrases.FORBIDDEN
      };
    }

    await httpClient.delete(`/offers/${offerId}`);

    return {
      statusCode: StatusCodes.NO_CONTENT
    };
  } catch (error) {
    if (error.response && error.response.status) {
      return {
        statusCode: error.response.status,
        body: error.response.data || getReasonPhrase(error.response.status)
      };
    }

    logger.error(`Error deleting offer`, error, event);

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
});

handler.use(cors());

module.exports.handler = handler;

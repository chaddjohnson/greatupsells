const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const {
  StatusCodes,
  ReasonPhrases,
  getReasonPhrase
} = require('http-status-codes');
const { aws4Interceptor } = require('aws4-axios');
const HttpClient = require('@neatowebsolutions/upselling-http-client').default;
const logger = require('@neatowebsolutions/upselling-logger');

const { AWS_REGION, SHOPS_API_URL } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

httpClient.addRequestInterceptor(
  aws4Interceptor({
    region: AWS_REGION,
    service: 'execute-api'
  })
);

const handler = middy(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { shopId } = event.requestContext.authorizer.claims;
    const { offerId } = event.pathParameters;
    const { startAt, endAt } = event.queryStringParameters || {};
    const [offer, offerRevenueIncreases] = await Promise.all([
      httpClient.get(`/offers/${offerId}`),
      httpClient.get(
        `/offers/${offerId}/revenue-increases?startAt=${startAt}&endAt=${endAt}`
      )
    ]);
    const offerShopId = offer && offer.shop;

    if (!offer) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    if (shopId !== offerShopId) {
      await logger.warn(
        `Unauthorized access attempt for offer ${offerId} revenue increases`,
        event
      );

      return {
        statusCode: StatusCodes.FORBIDDEN,
        body: ReasonPhrases.FORBIDDEN
      };
    }

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(offerRevenueIncreases)
    };
  } catch (error) {
    if (error.response && error.response.status) {
      return {
        statusCode: error.response.status,
        body: error.response.data || getReasonPhrase(error.response.status)
      };
    }

    await logger.error(
      `Error requesting offer revenue increases`,
      error,
      event
    );

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
});

handler.use(cors());

module.exports.handler = handler;

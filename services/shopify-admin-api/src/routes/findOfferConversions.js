const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const {
  StatusCodes,
  ReasonPhrases,
  getReasonPhrase
} = require('http-status-codes');
const { aws4Interceptor } = require('aws4-axios');
const HttpClient = require('@greatupsellshttp-client').default;
const logger = require('@greatupsellslogger');

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

  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  try {
    const { shopId } = event.requestContext.authorizer;
    const { offerId } = event.pathParameters;
    const { startAt, endAt } = event.queryStringParameters || {};
    const [offer, offerConversions] = await Promise.all([
      httpClient.get(`/offers/${offerId}`),
      httpClient.get(
        `/offers/${offerId}/conversions?startAt=${startAt}&endAt=${endAt}`
      )
    ]);
    const offerShopId = offer && offer.shop;

    if (shopId !== offerShopId) {
      await logger.warn(
        `Unauthorized access attempt for offer ${offerId} conversions`,
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
      body: JSON.stringify(offerConversions)
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

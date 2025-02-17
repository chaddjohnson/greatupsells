const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const { StatusCodes, ReasonPhrases, getReasonPhrase } = require('http-status-codes');
const qs = require('querystringify');
const HttpClient = require('@greatupsells/gateway-http-client');
const logger = require('@greatupsells/logger');

const { SHOPS_API_URL } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

const handler = middy(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  try {
    const { jwt } = event.requestContext.authorizer.lambda || event.requestContext.authorizer;
    const shopId = jwt.claims.sub;
    const { offerId } = event.pathParameters;
    const { startAt, endAt } = event.queryStringParameters || {};
    const params = qs.stringify({ startAt, endAt }, true);
    const [offer, offerConversionRates] = await Promise.all([
      httpClient.get(`/offers/${offerId}`),
      httpClient.get(`/offers/${offerId}/conversion-rates${params}`)
    ]);
    const offerShopId = offer && offer.shop;

    if (shopId !== offerShopId) {
      await logger.warn(`Unauthorized access attempt for offer ${offerId} conversion rates`, null, { event });

      return {
        statusCode: StatusCodes.FORBIDDEN,
        body: ReasonPhrases.FORBIDDEN
      };
    }

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(offerConversionRates)
    };
  } catch (error) {
    if (error.response && error.response.status) {
      return {
        statusCode: error.response.status,
        body: JSON.stringify(error.response.data) || getReasonPhrase(error.response.status)
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

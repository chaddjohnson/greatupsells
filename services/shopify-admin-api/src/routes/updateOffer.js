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

  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  try {
    const { shopId } = event.requestContext.authorizer;
    const { offerId } = event.pathParameters;
    const [shop, offer] = await Promise.all([
      httpClient.get(`/shops/${shopId}`),
      httpClient.get(`/offers/${offerId}`)
    ]);
    const offerShopId = offer && offer.shop;
    const data = JSON.parse(event.body);

    if (shopId !== offerShopId) {
      await logger.warn(
        `Unauthorized update attempt for offer ${offerId}`,
        null,
        { data, event }
      );

      return {
        statusCode: StatusCodes.FORBIDDEN,
        body: ReasonPhrases.FORBIDDEN
      };
    }

    data.shop = shop._id;
    data.shopifyShopId = shop.shopifyShopId;

    // Disallow updating specific fields.
    delete data.impressionCount;
    delete data.acceptanceCount;
    delete data.conversionCount;
    delete data.conversionRate;
    delete data.revenueIncrease;

    const updatedOffer = await httpClient.put(`/offers/${offerId}`, data);

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(updatedOffer)
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

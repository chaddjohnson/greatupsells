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
    const offer = await httpClient.get(`/offers/${offerId}`);
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

    // Disallow updating specific fields.
    delete data.shop;
    delete data.shopifyShopId;
    delete data.impressionCount;
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

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
});

handler.use(cors());

module.exports.handler = handler;

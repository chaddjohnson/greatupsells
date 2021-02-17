const URL = require('url');
const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const {
  StatusCodes,
  ReasonPhrases,
  getReasonPhrase
} = require('http-status-codes');
const qs = require('qs');
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
    const domain = URL.parse(event.headers.Origin).host;
    const { event: triggerEvent } = event.queryStringParameters || {};
    const { shopifyProductIds } = event.multiValueQueryStringParameters || {};

    const offerParams = qs.stringify(
      {
        event: triggerEvent,
        shopifyProductIds
      },
      { arrayFormat: 'repeat' }
    );

    // Look up offers by domain to reduce this method's latency.
    const [shop, offer] = await Promise.all([
      httpClient.get(`/shops/domain/${domain}`),
      httpClient.get(`/shops/domain/${domain}/offers/random?${offerParams}`)
    ]);

    if (!shop) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    if (!offer) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
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
        body: error.response.data || getReasonPhrase(error.response.status)
      };
    }

    await logger.error(`Error requesting random offer for shop`, error, event);

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
});

handler.use(cors());

module.exports.handler = handler;

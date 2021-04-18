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
    const ipAddress =
      event.requestContext.identity.sourceIp ||
      event.headers['X-Forwarded-For'];
    const domain = new URL(event.headers.Origin).host;
    const { event: triggerEvent } = event.queryStringParameters || {};
    const { shopifyProductIds } = event.multiValueQueryStringParameters || {};

    const offerParams = qs.stringify(
      {
        event: triggerEvent,
        shopifyProductIds,
        ipAddress
      },
      { arrayFormat: 'repeat' }
    );

    // Look up offer by domain to reduce this method's latency. Offer and product
    // are combined into one response to reduce latency.
    const [shop, { offer, offeredProducts }] = await Promise.all([
      httpClient.get(`/shops/domain/${domain}`),
      httpClient.get(`/shops/domain/${domain}/offers/random?${offerParams}`)
    ]);

    if (!shop || !offer) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify({
        offer,
        offeredProducts
      })
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

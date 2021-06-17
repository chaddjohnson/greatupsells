const { URL } = require('url');
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
    const domain = new URL(event.headers.Origin).host;
    const { draftOrderId } = event.pathParameters;
    const shop = await httpClient.get(`/shops/domain/${domain}`);
    const shopId = shop._id;
    const data = JSON.parse(event.body);
    const { offerId } = data;
    const offer = offerId && (await httpClient.get(`/offers/${offerId}`));

    // Verify any offer associated with the line item belongs to the shop.
    if (offerId && offer.shop !== shopId) {
      await logger.warn(
        `Unauthorized usage attempt for offer from domain ${domain}`,
        null,
        { event }
      );

      return {
        statusCode: StatusCodes.FORBIDDEN,
        body: ReasonPhrases.FORBIDDEN
      };
    }

    const draftOrder = await httpClient.post(
      `/shops/${shopId}/draft-orders/${draftOrderId}/line-items`,
      data
    );

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(draftOrder)
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

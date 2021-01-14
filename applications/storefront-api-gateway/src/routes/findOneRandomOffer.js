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
    const domain = event.headers.Host || event.requestContext.domainName;
    const { event: triggerEvent } = event.queryStringParameters;
    const { shopifyProductIds } = event.multiValueQueryStringParameters;
    const shop = await httpClient.get(`/shops/domain/${domain}`);

    if (!shop) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    const shopId = shop._id;
    const shopifyProductIdsParam = shopifyProductIds.map(
      (shopifyProductId) => `shopifyProductIds=${shopifyProductId}`
    );
    const offer = await httpClient.get(
      `/shops/${shopId}/offers/random?event=${triggerEvent}&${shopifyProductIdsParam}`
    );

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

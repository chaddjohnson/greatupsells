const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const {
  StatusCodes,
  ReasonPhrases,
  getReasonPhrase
} = require('http-status-codes');
const HttpClient = require('@greatupsells/gateway-http-client');

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
    const { shopId } = event.requestContext.authorizer.lambda;
    const shop = await httpClient.get(`/shops/${shopId}`);
    const data = JSON.parse(event.body);

    data.shop = shop._id;
    data.shopifyShopId = shop.shopifyShopId;

    // Disallow setting specific fields.
    delete data.impressionCount;
    delete data.acceptanceCount;
    delete data.conversionCount;
    delete data.conversionRate;
    delete data.revenueIncrease;

    const offer = await httpClient.post(`/offers`, data);

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(offer)
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

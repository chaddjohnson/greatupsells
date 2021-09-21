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
  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const domain = new URL(event.headers.origin || event.headers.Origin).host;
    const { draftOrderId, shopifyVariantId } = event.pathParameters;
    const shop = await httpClient.get(`/shops/domain/${domain}`);
    const shopId = shop._id;
    const { quantity } = JSON.parse(event.body);

    const draftOrder = await httpClient.post(
      `/shops/${shopId}/draft-orders/${draftOrderId}/line-items/${shopifyVariantId}`,
      { quantity }
    );

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(draftOrder)
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
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
});

handler.use(cors());

module.exports.handler = handler;

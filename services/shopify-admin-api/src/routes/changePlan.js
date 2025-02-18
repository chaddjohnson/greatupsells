const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const { StatusCodes, ReasonPhrases, getReasonPhrase } = require('http-status-codes');
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
    const { shopId } = event.requestContext.authorizer.lambda || event.requestContext.authorizer;
    const { level } = JSON.parse(event.body);
    const { redirectUrl } = await httpClient.post(`/shops/${shopId}/plan`, {
      level
    });

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify({ redirectUrl })
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

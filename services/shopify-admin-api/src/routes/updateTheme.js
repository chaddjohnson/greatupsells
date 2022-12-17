const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const {
  StatusCodes,
  ReasonPhrases,
  getReasonPhrase
} = require('http-status-codes');
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
    const { shopId } = event.requestContext.authorizer;
    const { themeId } = event.pathParameters;
    const theme = await httpClient.get(`/themes/${themeId}`);
    const offer = await httpClient.get(`/offers/${theme.offer}`);
    const data = JSON.parse(event.body);

    if (offer.shop !== shopId) {
      await logger.warn(
        `Unauthorized update attempt for theme ${themeId}`,
        null,
        { data, event }
      );

      return {
        statusCode: StatusCodes.FORBIDDEN,
        body: ReasonPhrases.FORBIDDEN
      };
    }

    const updatedTheme = await httpClient.put(`/themes/${themeId}`, data);

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(updatedTheme)
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

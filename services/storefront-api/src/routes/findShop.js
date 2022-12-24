const { URL } = require('url');
const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
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
    const domain = new URL(
      event.headers.shop || event.headers.origin || event.headers.Origin
    ).host;
    const shop = await httpClient.get(`/shops/domain/${domain}`);
    const { countryCode, currency, locale, timezone } = shop;

    return {
      statusCode: StatusCodes.NOT_MODIFIED,
      headers: {
        'cache-control': 'max-age=300'
      },
      body: JSON.stringify({
        domain,
        countryCode,
        currency,
        locale,
        timezone
      })
    };
  } catch (error) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
});

handler.use(cors());

module.exports.handler = handler;

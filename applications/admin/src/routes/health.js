const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const HttpClient = require('@neatowebsolutions/upselling-http-client').default;

const { SHOPS_API_URL, ADMIN_API_URL } = process.env;

const shopsServiceHttpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});
const adminApiHttpClient = new HttpClient({
  baseUrl: ADMIN_API_URL
});

const handler = middy(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await Promise.all([
      await shopsServiceHttpClient.get('/health'),
      await adminApiHttpClient.get('/health')
    ]);

    return {
      statusCode: StatusCodes.OK,
      body: ReasonPhrases.OK
    };
  } catch (error) {
    console.error(error.stack); // eslint-disable-line no-console

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
});

handler.use(cors());

module.exports.handler = handler;

const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const {
  StatusCodes,
  ReasonPhrases,
  getReasonPhrase
} = require('http-status-codes');
const qs = require('qs');
const HttpClient = require('@greatupsells/gateway-http-client');

const { LOGS_API_URL } = process.env;

const httpClient = new HttpClient({
  baseUrl: LOGS_API_URL
});

const handler = middy(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { query, type, page, pageSize } = event.queryStringParameters || {};
    const params = qs.stringify({ query, type, page, pageSize });
    const logs = await httpClient.get(`/logs?${params}`);

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(logs)
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

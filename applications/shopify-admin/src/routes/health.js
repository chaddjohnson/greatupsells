const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const redis = require('redis');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const { REDIS_URL_APP } = process.env;

const handler = middy(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    redis.createClient({ url: REDIS_URL_APP });

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

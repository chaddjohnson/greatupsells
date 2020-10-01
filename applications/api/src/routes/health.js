const middy = require('@middy/core');
const httpErrorHandler = require('@middy/http-error-handler');
const cors = require('@middy/http-cors');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const mongodbClientFactory = require('@chaddjohnson/mongodb-client-lambda')
  .factory;

const { MONGODB_URI } = process.env;
const mongodbClient = mongodbClientFactory.get(MONGODB_URI);

const handler = middy(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await mongodbClient.connect();

    if (!mongodbClient.connected) {
      throw new Error(`Cannot connect to database`);
    }

    return {
      statusCode: StatusCodes.OK,
      body: ReasonPhrases.OK
    };
  } catch (error) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
});

handler.use(httpErrorHandler()).use(cors());

module.exports.handler = handler;

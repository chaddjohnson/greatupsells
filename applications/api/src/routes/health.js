const middy = require('@middy/core');
const httpErrorHandler = require('@middy/http-error-handler');
const cors = require('@middy/http-cors');
const httpStatus = require('http-status-codes');
const mongodbClientFactory = require('@chaddjohnson/mongodb-client-lambda')
  .factory;

const { MONGODB_URI } = process.env;
const mongodbClient = mongodbClientFactory.get(MONGODB_URI);

const handler = middy(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await mongodbClient.connect();

    if (!mongodbClient.connected) {
      throw new Error(`Cannot connect to MongoDB`);
    }

    return {
      statusCode: httpStatus.OK,
      body: 'OK'
    };
  } catch (error) {
    return {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      body: error.message
    };
  }
});

handler.use(httpErrorHandler()).use(cors());

module.exports.handler = handler;

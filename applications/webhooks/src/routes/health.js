const httpStatus = require('http-status-codes');
const mongodbClientFactory = require('@chaddjohnson/mongodb-client-lambda')
  .factory;

const { MONGODB_URI } = process.env;
const mongodbClient = mongodbClientFactory.get(MONGODB_URI);

const handler = async (request, response) => {
  try {
    await mongodbClient.connect();

    if (!mongodbClient.connected) {
      throw new Error(`Cannot connect to database`);
    }

    response.status(httpStatus.OK).send('OK');
  } catch (error) {
    response
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(error.message || 'error');
  }
};

module.exports = handler;

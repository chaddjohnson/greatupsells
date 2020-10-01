const { StatusCodes, ReasonPhrases } = require('http-status-codes');
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

    response.status(StatusCodes.OK).send(ReasonPhrases.OK);
  } catch (error) {
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

module.exports = handler;

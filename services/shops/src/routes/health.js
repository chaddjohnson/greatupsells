const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const mongodbClient = require('../models/mongodbClient');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await mongodbClient.connect();

    if (!mongodbClient.connected) {
      throw new Error(`Cannot connect to MongoDB`);
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
};

module.exports.handler = handler;

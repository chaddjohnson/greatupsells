const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const mongodbClient = require('../models/mongodbClient');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log('health 1');
  try {
    await mongodbClient.connect();
    console.log('health 2');

    if (!mongodbClient.connected) {
      throw new Error(`Cannot connect to MongoDB`);
    }
    console.log('health 3');

    return {
      statusCode: StatusCodes.OK,
      body: ReasonPhrases.OK
    };
  } catch (error) {
    console.log('health 4');
    console.log(error);
    console.error(error.stack); // eslint-disable-line no-console
    console.log('health 5');

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

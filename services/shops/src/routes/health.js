const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const mongodbClient = require('../models/mongodbClient');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log('HEALTH 1');
  try {
    await mongodbClient.connect();
    console.log('HEALTH 2');

    if (!mongodbClient.connected) {
      console.log('HEALTH 3');
      throw new Error(`Cannot connect to MongoDB`);
    }
    console.log('HEALTH 4');

    return {
      statusCode: StatusCodes.OK,
      body: ReasonPhrases.OK
    };
  } catch (error) {
    console.log('HEALTH 5');
    console.log(error);
    console.error(error.stack); // eslint-disable-line no-console

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

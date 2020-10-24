const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { mongodbClient } = require('@neatowebsolutions/upselling-models');

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

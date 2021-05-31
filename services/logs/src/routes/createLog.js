const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const models = require('../models');

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const Log = await models.get('Log');
    const { source, type, message, stackTrace, data } = JSON.parse(event.body);
    const log = new Log({ source, type, message, stackTrace, data });

    try {
      await log.validate();
    } catch (error) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: ReasonPhrases.BAD_REQUEST
      };
    }

    await log.save();

    return {
      statusCode: StatusCodes.NO_CONTENT
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      `Error creating log`,
      error.stack,
      JSON.stringify(event.body, null, 2)
    );

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;

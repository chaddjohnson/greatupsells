const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@greatupsells/logger');

const { AWS_REGION } = process.env;

// const handler = middy(async () => ({
//   statusCode: StatusCodes.OK,
//   body: AWS_REGION
// }));

// handler.use(cors());

// module.exports.handler = handler;

const handler = middy(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    throw new Error('Test error');
  } catch (error) {
    await logger.error(error.message, error, { event });
  }

  return {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    body: ReasonPhrases.INTERNAL_SERVER_ERROR
  };
});

handler.use(cors());

module.exports.handler = handler;

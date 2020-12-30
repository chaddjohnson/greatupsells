const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const handler = async () => ({
  statusCode: StatusCodes.OK,
  body: ReasonPhrases.OK
});

module.exports.handler = handler;

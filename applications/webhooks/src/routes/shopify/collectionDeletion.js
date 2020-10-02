const { StatusCodes } = require('http-status-codes');

const handler = async (request, response) => {
  // TODO

  response.status(StatusCodes.OK).end();
};

module.exports = handler;

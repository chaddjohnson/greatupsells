const { StatusCodes } = require('http-status-codes');

const handler = async (request, response) => {
  // TODO

  // TODO: Mark as deleted, but do not delete.

  response.status(StatusCodes.OK).end();
};

module.exports = handler;

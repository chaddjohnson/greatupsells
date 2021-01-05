const { StatusCodes } = require('http-status-codes');

const { AWS_REGION } = process.env;

const handler = async () => ({
  statusCode: StatusCodes.OK,
  body: AWS_REGION
});

module.exports.handler = handler;

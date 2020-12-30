const { StatusCodes } = require('http-status-codes');

const { AWS_REGION } = process.env;

module.exports.handler = async () => {
  return {
    statusCode: StatusCodes.OK,
    body: AWS_REGION
  };
};
